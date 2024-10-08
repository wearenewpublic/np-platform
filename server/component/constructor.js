const { getConstructor } = require("../constructor");

async function runConstructorApi({serverstore}) {
    const constructor = getConstructor(serverstore.getStructureKey());
    if (!constructor) {
        throw new Error('No constructor found for ' + serverstore.getStructureKey());
    }

    await constructor({serverstore});
    serverstore.setGlobalProperty('initialized', Date.now());
}
exports.runConstructorApi = runConstructorApi;

exports.publicFunctions = {
    runConstructor: runConstructorApi
}
