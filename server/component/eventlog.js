const { checkIsGlobalAdmin } = require("../util/admin");
const { firebaseWriteAsync, firebaseUpdateAsync, createNewKey, firebaseGetUserAsync, firebaseReadAsync, firebaseReadWithFilterAsync, firebaseReadPaginatedAsync } = require("../util/firebaseutil");
const { ServerStore } = require("../util/serverstore");

async function logEventApi({
        sessionKey, isNewSession, deviceInfo=null, userId, 
        siloKey, structureKey, instanceKey, 
        eventType, params}) {

    const eventKey = createNewKey();
    const time = Date.now();
    var userName = null;
    var userPhoto = null;

    if (userId) {
        const userInfo = await firebaseGetUserAsync(userId);
        userName = userInfo.displayName;
        userPhoto = userInfo.photoURL ?? null;
    }

    firebaseWriteAsync(['log', 'event', eventKey], {
        sessionKey, siloKey, structureKey, instanceKey, eventType, time, userName, ...params
    })

    if (isNewSession) {
        firebaseWriteAsync(['log', 'session', sessionKey], {
            userId, siloKey, userName, userPhoto, deviceInfo,
            startTime: Date.now(), endTime: Date.now()
        })
    } else if (userId) {
        firebaseUpdateAsync(['log', 'session', sessionKey], {userId, siloKey, userName, userPhoto, endTime: Date.now()})
    } else {
        firebaseUpdateAsync(['log', 'session', sessionKey], {siloKey, endTime: Date.now()})
    }

    return {eventKey}
}
exports.logEventApi = logEventApi;

async function setSessionUserApi({sessionKey, userId, eventKey}) {
    if (userId) {
        const userInfo = await firebaseGetUserAsync(userId);
        const userName = userInfo.displayName;
        const userPhoto = userInfo.photoURL ?? null;
        await firebaseUpdateAsync(['log', 'session', sessionKey], {userId, userName, userPhoto})
        if (eventKey) {
            await firebaseUpdateAsync(['log', 'event', eventKey], {userName});
        }
    }
}
exports.setSessionUserApi = setSessionUserApi;

// TODO: Proper way of having global admin access
// TODO: Support silo-limited version where you only see events from that silo
// TODO: Index-based event filtering
async function getEventsApi({serverstore, filterSiloKey, eventType, sessionKey}) {
    checkIsGlobalAdmin(serverstore);
    var events = null;
    if (sessionKey) {
        events = await firebaseReadWithFilterAsync(['log', 'event'], 'sessionKey', sessionKey);
    } else if (eventType) {
        events = await firebaseReadWithFilterAsync(['log', 'event'], 'eventType', eventType);
    } else if (filterSiloKey) {
        events = await firebaseReadWithFilterAsync(['log', 'event'], 'siloKey', filterSiloKey);
    } else {
        events = await firebaseReadAsync(['log', 'event']);
    }

    return events;
}
exports.getEventsApi = getEventsApi;

async function getSessionsApi({serverstore, filterSiloKey}) {
    checkIsGlobalAdmin(serverstore);
    var sessions = null;
    if (filterSiloKey) {
        sessions = await firebaseReadWithFilterAsync(['log', 'session'], 'siloKey', filterSiloKey);
    } else {
        sessions = await firebaseReadAsync(['log', 'session']);
    }
    return sessions;
}
exports.getSessionsApi = getSessionsApi;

async function getSingleSessionApi({serverstore, sessionKey}) {
    checkIsGlobalAdmin(serverstore);
    return await firebaseReadAsync(['log', 'session', sessionKey]);
}
exports.getSingleSessionApi = getSingleSessionApi;


function getDayNumberForTime(time) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(time / millisecondsPerDay);
}

function getIsoDateForTime(time) {
    return new Date(time).toISOString().substring(0, 10);
}

function updateEventCountsForEvent({eventCounts, event}) {
    if (!eventCounts[event.eventType]) {
        eventCounts[event.eventType] = {};
    }
    const day = new Date(event.time).toISOString().substring(0, 10);
    eventCounts[event.eventType][day] = (eventCounts[event.eventType][day] || 0) + 1;
}

async function aggregateLogsAsync({serverstore, stride=1000} = {}) {
    const daysToKeep = 30;
    const thisDay = getDayNumberForTime(Date.now());
    const oldestDayToKeep = thisDay - daysToKeep;
    var startAfter = null;
    var eventCounts = {};
    var eventsToDelete = {};
    const limit = stride;
    var events = null;
    var badEvents = {};

    do {
        events = await firebaseReadPaginatedAsync(['log', 'event'], limit, startAfter);
        if (!events) break;
        const eventKeys = Object.keys(events);
        for (const eventKey of eventKeys) {
            const event = events[eventKey];
            try {
                if (getDayNumberForTime(event.time) < oldestDayToKeep) {
                    updateEventCountsForEvent({eventCounts, event});
                    eventsToDelete[eventKey] = null;
                } else if (event.time && event.eventType) {
                    // TOO New to delete, but valid
                } else {
                    console.error('bad event', event);
                    badEvents[eventKey] = event;
                    eventsToDelete[eventKey] = null;
                }
            } catch (e) {
                badEvents[eventKey] = event;
                eventsToDelete[eventKey] = null;
                console.error('Bad event', event, e);
            }
        }
        startAfter = eventKeys[eventKeys.length - 1];
    } while (events && Object.keys(events).length >= limit);

    const types = Object.keys(eventCounts);
    for (const type of types) {
        for (const day of Object.keys(eventCounts[type])) {
            serverstore.doDelayedWrite(['log', 'aggregated', type, day], eventCounts[type][day]);
        }
    }
    serverstore.doDelayedWrite(['log', 'badEvents'], badEvents);

    for (const key of Object.keys(eventsToDelete)) {
        serverstore.doDelayedWrite(['log', 'event', key], null);
    }
}
exports.aggregateLogsAsync = aggregateLogsAsync;

async function aggregateLogsFromCronAsync() {
    const serverstore = new ServerStore({siloKey: 'cron', structureKey: 'cron', instanceKey: 'cron'});
    await aggregateLogsAsync({serverstore});
    await serverstore.commitDataAsync();
}

exports.aggregateLogsFromCron = aggregateLogsFromCronAsync;


exports.publicFunctions = {
    logEvent: logEventApi,
    setSessionUser: setSessionUserApi,
    aggregateLogs: aggregateLogsAsync,
}

exports.adminFunctions = {
    getEvents: getEventsApi,
    getSessions: getSessionsApi,
    getSingleSession: getSingleSessionApi,
}
