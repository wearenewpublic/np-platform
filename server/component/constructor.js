const { writeGlobalAsync } = require("np-platform-server/util/firebaseutil");
const { getConstructor } = require("../constructor");

async function runConstructorApi({siloKey, structureKey, instanceKey}) {
    const constructorObj = getConstructor(structureKey);
    if (constructorObj?.constructor) {
        try {
            await constructorObj.constructor({siloKey, structureKey, instanceKey});
            await writeGlobalAsync({siloKey, structureKey, instanceKey, key: 'initialized', value: Date.now()});
            return {success: true}
        } catch (e) {
            return {success: false, error: e.message};
        }
    } else {
        return {success: false, error: 'No constructor found for ' + structureKey};
    }
}

exports.apiFunctions = {
    runConstructor: runConstructorApi
}
