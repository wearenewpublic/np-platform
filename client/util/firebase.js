import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCustomToken, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase, limitToFirst, limitToLast, onValue, orderByKey, push, get, query, ref, set } from "firebase/database";
import { useEffect, useState } from 'react';
import { getIsLocalhost } from "../platform-specific/url";

var app = null;
var auth = null;
var database = null;
var global_firebaseUser = null;
var global_fbuser_watchers = [];

export function setFirebaseConfig(firebaseConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);

    if (getIsLocalhost()) {
        const host = window.location.hostname;
        console.log('Using local database and auth emulator');
        connectDatabaseEmulator(database, host, 9000);
        connectAuthEmulator(auth, `http://${host}:9099`);
    }

    onAuthStateChanged(auth, (user) => {
        global_firebaseUser = user;
        global_fbuser_watchers.forEach(watcher => watcher(user));
    });    
}

export function getFirebaseApp() {
    return app;

}

export function getFirebaseUser() {
    return global_firebaseUser;
}

export function useFirebaseUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            global_firebaseUser = user;
            setUser(user);
        });
        return unsubscribe;
    }, []);
    return user;           
}

export async function getFirebaseIdTokenAsync() {
    return await auth.currentUser?.getIdToken() || null;
}

export function firebaseSignOut() {
    auth.signOut();
}

export function onFbUserChanged(callback) {
    global_fbuser_watchers.push(callback);
}

export function firebaseNewKey() {
	return push(ref(database)).key;
}

export function firebaseWriteAsync(pathList, data) {
    const pathString = makeFirebasePath(pathList);
    return set(ref(database, pathString), data);
}

export function firebaseWatchValue(pathList, callback) {
    const pathString = makeFirebasePath(pathList);
    return onValue(ref(database, pathString), snapshot => {
        callback(snapshot.val())
    }, error => {
        console.error('Error in firebaseWatchValue', pathString, error);
    });
}

// This needs to cope with temporarily null path elements, so that we can
// use it to look up properties of a user, even when the user isn't logged in yet.
export function useFirebaseData(pathList, {defaultValue=null, limit=null, oldest=false, once=false}={}) {
    const [data, setData] = useState(undefined);
    const pathString = makeFirebasePath(pathList, true);
    const nullPath = pathList.some(p => p == null || p == undefined);

    useEffect(() => {
        if (nullPath) return;

        if (once) {
            getFirebaseDataAsync(pathList).then(data => {
                setData(data || defaultValue);
            });
        } else {
            let dbRef = ref(database, pathString);
            if (limit && oldest) {
                dbRef = query(dbRef, orderByKey(), limitToFirst(limit));
            } else if (limit && !oldest) {
                dbRef = query(dbRef, orderByKey(), limitToLast(limit));
            }

            const unsubscribe = onValue(dbRef, snapshot => {
                setData(snapshot.val() || defaultValue)
            });
            return unsubscribe;
        }
    }, [pathString, once, limit, oldest]);
    return data;
}


export async function getFirebaseDataAsync(pathList) {
    const pathString = makeFirebasePath(pathList);

    try {
        const snapshot = await get(ref(database, pathString));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        throw new Error('Error fetching data at path: ' + pathString + ' - ' + error.message);
    }
}


function makeFirebasePath(path, skipCheck=false) {
    if (typeof path == 'string') {
        return path;
    } else {
        if (!skipCheck && path.some(p => !p)) {
            console.error('Bad firebase path', path, skipCheck);
            throw new Error('Firebase path cannot contain null or undefined elements: ' + JSON.stringify(path));
        }
        return path.join('/');
    }
}

export function fbKeyToString(input) {
    const reverseMapping = {
        '%d': '.',
        '%h': '#',
        '%s': '$',
        '%f': '/',
        '%l': '[',
        '%r': ']',
        '%%': '%',
        '%q': "'"
    };

    return input.replace(/%d|%h|%s|%f|%l|%r|%%|%q/g, match => reverseMapping[match]);
}

export function stringToFbKey(input) {
    const mapping = {
        '.': '%d',
        '#': '%h',
        '$': '%s',
        '/': '%f',
        '[': '%l',
        ']': '%r',
        '%': '%%',
        "'": '%q'
    };

    return input.replace(/[.$#/[\]%]/g, match => mapping[match]);
}

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export async function signInWithTokenAsync(token) {
    return await signInWithCustomToken(auth, token);
}


