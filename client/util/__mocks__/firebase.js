import { getObjectPropertyPath, setObjectPropertyPath} from "../util";

export function firebaseSignOut() {}
export function onFbUserChanged() {}
export function getFirebaseUser() {return 'user'}
export async function getFirebaseIdTokenAsync() {return 'token'}
export function useFirebaseUser() {return {uid: 'a', displayName: 'Alice Adams', email: 'alice@adams.org'}}
export function signInWithPopup() {}
export function signInWithEmailAndPassword() {}
export function firebaseWatchValue() {}
export const auth = {};
export const GoogleAuthProvider = {}
export const FacebookAuthProvider = {}
export function firebaseWriteAsync() {}
export function fbKeyToString(key) {return key}

var global_firebaseData = {};
export function useFirebaseData(path) {return getObjectPropertyPath(global_firebaseData, path)};
export function mock_setFirebaseData(path, value) {global_firebaseData = setObjectPropertyPath(global_firebaseData, path, value)}

