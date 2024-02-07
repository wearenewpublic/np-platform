const { writeGlobalAsync } = require("np-platform-server/util/firebaseutil");
const { getConstructor } = require("../constructor");

async function runConstructorApi({structureKey, instanceKey}) {
    const constructorObj = getConstructor(structureKey);
    if (constructorObj?.constructor) {
        try {
            await constructorObj.constructor({instanceKey});
            await writeGlobalAsync({structure: structureKey, instance: instanceKey, key: 'initialized', value: Date.now()});
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
