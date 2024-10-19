import {getConstructor} from "../constructor";

async function runConstructorApi({serverstore}) {
    const constructor = getConstructor(serverstore.getStructureKey());
    if (!constructor) {
        throw new Error('No constructor found for ' + serverstore.getStructureKey());
    }

    await constructor({serverstore});
    serverstore.setGlobalProperty('initialized', Date.now());
}
export {runConstructorApi};

export var publicFunctions = {
    runConstructor: runConstructorApi
};

export default {publicFunctions};