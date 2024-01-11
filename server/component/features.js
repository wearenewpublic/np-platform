const { firebaseWriteAsync } = require("../util/firebaseutil")

// TODO: Only allow an admin to call this function
async function setFeaturesAsync({structureKey, instanceKey, features, userId, userEmail}) {
    console.log('setFeaturesAsync', structureKey, instanceKey, features);
    await firebaseWriteAsync(['structure', structureKey, 'instance', instanceKey, 'global', 'features'], features);
    return {success: true}
}

exports.apiFunctions = {
    setFeatures: setFeaturesAsync
}
