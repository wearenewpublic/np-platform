import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyDIg3OR3i51VYrUyUd_L5iIownjdSnExlc",
    authDomain: "np-psi-dev.firebaseapp.com",
    databaseURL: "https://np-psi-dev-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "np-psi-dev",
    storageBucket: "np-psi-dev.appspot.com",
    messagingSenderId: "768032889623",
    appId: "1:768032889623:web:634a1604eda03820ab7552"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

if (window.location.hostname === "localhost") {
    console.log('Using local database and auth emulator');
    connectDatabaseEmulator(database, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
}

var global_firebaseUser = null;

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

export function getFirebaseUser() {
    return global_firebaseUser;
}

onAuthStateChanged(auth, (user) => {
    global_firebaseUser = user;
});

export async function getFirebaseIdTokenAsync() {
    return await auth.currentUser?.getIdToken() || null;
}

export function firebaseSignOut() {
    auth.signOut();
}

export function onFbUserChanged(callback) {
    return onAuthStateChanged(auth, callback);
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

export function useFirebaseData(pathList, defaultValue=null) {
    const [data, setData] = useState(null);
    const pathString = makeFirebasePath(pathList);
    const nullPath = pathList.some(p => p == null || p == undefined);

    useEffect(() => {
        if (nullPath) return;
        const unsubscribe = onValue(ref(database, pathString), snapshot => {
            setData(snapshot.val() || defaultValue)
        });
        return unsubscribe;
    }, [pathString]);
    return data;
}

export function getFirebaseDataAsync(pathList) {
    const pathString = makeFirebasePath(pathList);
    return ref(database, pathString).get().then(snapshot => snapshot.val());
}

function makeFirebasePath(pathList) {
    return pathList.join('/');
}

function fbKeyToString(input) {
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

    return input.replace(/%d|%h|%s|%f|%l|%r|%%/g, match => reverseMapping[match]);
}


export {fbKeyToString, auth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword};

