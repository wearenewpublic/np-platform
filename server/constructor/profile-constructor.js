const {firebaseGetUserAsync, writeGlobalAsync, setObjectAsync} = require('../util/firebaseutil');

const ProfileConstructor = {
    constructor: constructorAsync
}
exports.ProfileConstructor = ProfileConstructor;

async function constructorAsync({instanceKey}) {
    console.log('ProfileConstructor.constructor 2', {instanceKey});
    const userId = instanceKey;
    const fbUser = await firebaseGetUserAsync(userId);
    if (!fbUser) {
        throw new Error('User not found');
    }
    await  setObjectAsync({structure: 'profile', instance: instanceKey,
        collection: 'persona', key: userId, value: {
            name: fbUser.displayName || null,
            photoUrl: fbUser.photoURL || null
        }})
}

