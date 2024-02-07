const {firebaseGetUserAsync, writeGlobalAsync} = require('../util/firebaseutil');

const ProfileConstructor = {
    constructor: constructorAsync
}
exports.ProfileConstructor = ProfileConstructor;

async function constructorAsync({instanceKey}) {
    console.log('ProfileConstructor.constructor', {instanceKey});
    const userId = instanceKey;
    const fbUser = await firebaseGetUserAsync(userId);
    if (!fbUser) {
        throw new Error('User not found');
    }
    const pName = writeGlobalAsync({
        structure: 'profile', instance: instanceKey, 
        key: 'name', value: fbUser.displayName});
    const pPhotoUrl = writeGlobalAsync({
        structure: 'profile', instance: instanceKey, 
        key: 'photoUrl', value: fbUser.photoURL});
    await Promise.all([pName, pPhotoUrl]);
}

