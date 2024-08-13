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
        userPhoto = userInfo.photoURL;
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

    return {success: true, data: {eventKey}}
}
exports.logEventApi = logEventApi;

async function setSessionUserApi({sessionKey, userId, eventKey}) {
    if (userId) {
        const userInfo = await firebaseGetUserAsync(userId);
        const userName = userInfo.displayName;
        const userPhoto = userInfo.photoURL;
        await firebaseUpdateAsync(['log', 'session', sessionKey], {userId, userName, userPhoto})
        if (eventKey) {
            await firebaseUpdateAsync(['log', 'event', eventKey], {userName});
        }
    }
    return {success: true}
}
exports.setSessionUserApi = setSessionUserApi;

function getIsGlobalAdmin(userEmail) {
    const emailDomain = userEmail.split('@')[1];
    return emailDomain == 'newpublic.org' || emailDomain == 'admin.org';
}

// TODO: Proper way of having global admin access
// TODO: Support silo-limited version where you only see events from that silo
// TODO: Index-based event filtering
async function getEventsApi({userId, userEmail, siloKey, eventType, sessionKey}) {
    const isAdmin = getIsGlobalAdmin(userEmail);
    if (!isAdmin) {
        return {success: false, error: 'Not authorized'};
    }
    var events = null;
    if (sessionKey) {
        events = await firebaseReadWithFilterAsync(['log', 'event'], 'sessionKey', sessionKey);
    } else if (eventType) {
        events = await firebaseReadWithFilterAsync(['log', 'event'], 'eventType', eventType);
    } else if (siloKey) {
        events = await firebaseReadWithFilterAsync(['log', 'event'], 'siloKey', siloKey);
    } else {
        events = await firebaseReadAsync(['log', 'event']);
    }

    return {success: true, data: events}
}
exports.getEventsApi = getEventsApi;

async function getSessionsApi({userId, userEmail, siloKey}) {
    const isAdmin = getIsGlobalAdmin(userEmail);
    if (!isAdmin) {
        return {success: false, error: 'Not authorized'};
    }
    var sessions = null;
    if (siloKey) {
        sessions = await firebaseReadWithFilterAsync(['log', 'session'], 'siloKey', siloKey);
    } else {
        sessions = await firebaseReadAsync(['log', 'session']);
    }
    return {success: true, data: sessions}
}
exports.getSessionsApi = getSessionsApi;

async function getSingleSessionApi({userId, userEmail, sessionKey}) {
    const isAdmin = getIsGlobalAdmin(userEmail);
    if (!isAdmin) {
        return {success: false, error: 'Not authorized'};
    }
    const session = await firebaseReadAsync(['log', 'session', sessionKey]);
    return {success: true, data: session}
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

