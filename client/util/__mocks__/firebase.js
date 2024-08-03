import { getObjectPropertyPath, setObjectPropertyPath} from "../util";

export function firebaseSignOut() {}
export function onFbUserChanged() {}
export function getFirebaseUser() {return 'user'}
export async function getFirebaseIdTokenAsync() {return 'token'}
export function useFirebaseUser() {return {uid: 'a', displayName: 'Alice Adams', email: 'alice@adams.org'}}

export const signInWithPopup = jest.fn();
export const signInWithGoogle = jest.fn();
// export function signInWithPopup() {}
export function signInWithEmailAndPassword() {}
export function firebaseWatchValue() {}
export const auth = {};
export class GoogleAuthProvider {}
export class FacebookAuthProvider {}
export function firebaseWriteAsync() {}
export function fbKeyToString(key) {return key}

var global_nextKey = 1;
export function firebaseNewKey() {return global_nextKey++}

var global_firebaseData = {};
export function useFirebaseData(path) {return getObjectPropertyPath(global_firebaseData, path)};
export function mock_setFirebaseData(path, value) {global_firebaseData = setObjectPropertyPath(global_firebaseData, path, value)}
export function getMockFirebaseData() {return global_firebaseData}
