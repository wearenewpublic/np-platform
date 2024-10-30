const { checkIsGlobalAdmin } = require("../util/admin");
const { firebaseWriteAsync, firebaseUpdateAsync, createNewKey, firebaseGetUserAsync, firebaseReadAsync, firebaseReadWithFilterAsync } = require("../util/firebaseutil");

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


exports.publicFunctions = {
    logEvent: logEventApi,
    setSessionUser: setSessionUserApi,
}

exports.adminFunctions = {
    getEvents: getEventsApi,
    getSessions: getSessionsApi,
    getSingleSession: getSingleSessionApi
}

