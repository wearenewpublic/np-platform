const {firebaseGetUserAsync, setObjectAsync} = require('../util/firebaseutil');

const ProfileConstructor = {
    constructor: constructorAsync
}
exports.ProfileConstructor = ProfileConstructor;

async function constructorAsync({siloKey, instanceKey}) {
    console.log('ProfileConstructor.constructor', {siloKey, instanceKey});
    const userId = instanceKey;
    const fbUser = await firebaseGetUserAsync(userId);
    if (!fbUser) {
        throw new Error('User not found');
    }
    await  setObjectAsync({siloKey, structureKey: 'profile', instanceKey,
        collection: 'persona', key: userId, value: {
            name: fbUser.displayName || null,
            photoUrl: fbUser.photoURL || null
        }})
}

