import { useDatastore } from "./datastore";
import { firebaseNewKey, getFirebaseUser, onFbUserChanged } from "./firebase";
import { callServerApiAsync } from "./servercall";
import { useEffect } from "react";

const hourMillis = 60*60*1000;

export const eventTypes = {
    'login-screen': 'Open the Login Screen',
    'login-request': 'Request to login',
    'login-success': 'Successful login',
    'open-composer': 'Open the Composer Screen to write a new top level response',
    'showReplies': 'Show replies to a post',
}

onFbUserChanged((userId) => {
    if (userId) {
        console.log('User changed', userId.uid);
        setSessionUserAsync(userId.uid);
    }
});

var global_last_event = null;

export async function setSessionUserAsync(userId) {
    const sessionKey = localStorage.getItem('sessionKey');
    if (sessionKey && userId) {
        await callServerApiAsync({component: 'eventlog', funcname: 'setSessionUser', params: {
            sessionKey, userId, eventKey: global_last_event
        }});
    }
}

export async function logEventAsync(datastore, eventType, params) {
    console.log('logEvent', eventType, params);
    var sessionKey = localStorage.getItem('sessionKey');
    var sessionTime = localStorage.getItem('sessionTime');
    var isNewSession = false;
    const preFirebaseUser = getFirebaseUser();
    
    if (!sessionKey || !sessionTime || Date.now() - sessionTime > hourMillis){
        sessionKey = firebaseNewKey();
        sessionTime = Date.now();
        console.log('New session', sessionKey, sessionTime);
        isNewSession = true;
        localStorage.setItem('sessionKey', sessionKey);
        localStorage.setItem('sessionTime', sessionTime);    
    } else {
        console.log('Existing session', sessionKey, sessionTime);
    }
    const result = await callServerApiAsync({datastore, component: 'eventlog', funcname: 'logEvent', params: {eventType, sessionKey, isNewSession, params}});
    global_last_event = result?.eventKey ?? null;
    console.log('logEvent result', result, global_last_event);

    const postFirebaseUser = getFirebaseUser();

    if (postFirebaseUser && !preFirebaseUser) {
        console.log('Logged in during event log. Setting session user');
        setSessionUserAsync(postFirebaseUser.uid);
        return;
    }

}

export async function useLogEvent(eventKey, params, skip=false) {
    const datastore = useDatastore();
    useEffect(() => {
        if (!skip) {
            logEventAsync(datastore, eventKey, params);
        }
    }, [eventKey, JSON.stringify(params), skip]);
}

export async function getLogEvents({siloKey, eventType, sessionKey} = {}) {
    console.log('getLogEvents', {siloKey, eventType, sessionKey});
    const eventObjs = await callServerApiAsync({component: 'eventlog', funcname: 'getEvents', params: {siloKey, eventType, sessionKey}});
    const eventKeys = Object.keys(eventObjs).sort((a, b) => eventObjs[b].time - eventObjs[a].time);
    return eventKeys.map(key => ({key, ...eventObjs[key]}));
}

export async function getSessions({siloKey = null} = {}) {
    const sessionObjs = await callServerApiAsync({component: 'eventlog', funcname: 'getSessions', params: {siloKey}});
    const sessionKeys = Object.keys(sessionObjs).sort((a, b) => sessionObjs[b].endTime - sessionObjs[a].endTime);
    return sessionKeys.map(key => ({key, ...sessionObjs[key]}));
}