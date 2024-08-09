const {firebaseGetUserAsync, setObjectAsync} = require('../util/firebaseutil');

async function profileConstructorAsync({siloKey, instanceKey}) {
    const userId = instanceKey;
    const fbUser = await firebaseGetUserAsync(userId);
    if (!fbUser) {
        throw new Error('User not found');
    }
    await  setObjectAsync({siloKey, structureKey: 'profile', instanceKey,
        collection: 'persona', key: userId, value: {
            name: fbUser.displayName || null,
            photoUrl: fbUser.photoURL || null
        }}
    );
}
exports.profileConstructorAsync = profileConstructorAsync;
