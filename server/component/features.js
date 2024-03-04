const { writeGlobalAsync } = require("../util/firebaseutil")

// TODO: Only allow an admin to call this function
async function setFeaturesApi({siloKey, structureKey, instanceKey, features, userId, userEmail}) {
    console.log('setFeaturesAsync', structureKey, instanceKey, features);
    // await firebaseWriteAsync(['structure', structureKey, 'instance', instanceKey, 'global', 'features'], features);
    await writeGlobalAsync({siloKey, structureKey, instanceKey, key: 'features', value: features});
    return {success: true}
}

exports.apiFunctions = {
    setFeatures: setFeaturesApi
}
