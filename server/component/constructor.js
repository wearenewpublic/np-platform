const { writeGlobalAsync } = require("np-platform-server/util/firebaseutil");
const { getConstructor } = require("../constructor");

async function runConstructorApi({siloKey, structureKey, instanceKey}) {
    const constructor = getConstructor(structureKey);
    if (constructor) {
        try {
            await constructor({siloKey, structureKey, instanceKey});
            await writeGlobalAsync({siloKey, structureKey, instanceKey, key: 'initialized', value: Date.now()});
            return {success: true}
        } catch (e) {
            return {success: false, error: e.message};
        }
    } else {
        return {success: false, error: 'No constructor found for ' + structureKey};
    }
}
exports.runConstructorApi = runConstructorApi;

exports.apiFunctions = {
    runConstructor: runConstructorApi
}
