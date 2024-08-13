const {firebaseGetUserAsync} = require('../util/firebaseutil');

async function profileConstructorAsync({serverstore}) {
    const userId = serverstore.getInstanceKey();
    const fbUser = await firebaseGetUserAsync(userId);
    if (!fbUser) {
        throw new Error('User not found');
    }
    await serverstore.setObjectAsync('profile', userId, {
        name: fbUser.displayName || null,
        photoUrl: fbUser.photoURL || null
    });
}
exports.profileConstructorAsync = profileConstructorAsync;
