const { getDerivedViews } = require("../derived-views");
const { firebaseUpdateAsync, readMultipleCollectionsAsync, readObjectAsync, readAllGlobalsAsync } = require("../util/firebaseutil");

class TriggerDatastore{
    constructor(siloKey, collections, globals) {
        this.siloKey = siloKey,
        this.collections = collections;
        this.globals = globals;
        this.output = {};
    }

    getCollection(type) {
        const collection = this.collections[type];
        const keys = Object.keys(collection || {});
        return keys.map(key => collection[key]);
    }

    getObject(type, key) {
        const collection = this.collections[type];
        return collection[key];
    }

    getGlobal(key) {
        return this.globals[key];
    }

    setGlobal({structureKey, instanceKey, key, value}) {
        this.output['structure/' + structureKey + '/instance/' + instanceKey + '/global/' + key] = value;
    }

    setDerivedObject({structureKey, instanceKey, type, key, value}) {
        this.output['structure/' + structureKey + '/instance/' + instanceKey + '/collection/derived_' + type + '/' + key] = value;     
    }
    
    async commitDataAsync() {
        return await firebaseUpdateAsync('/silo/' + this.siloKey + '/', this.output);
    }
}
exports.TriggerDatastore = TriggerDatastore;


async function runSingleTriggerAsync({view, siloKey, structureKey, instanceKey, key, value}) {
    const pGlobals = await readAllGlobalsAsync({siloKey, structureKey, instanceKey});
    const collections = await readMultipleCollectionsAsync({
        siloKey, structureKey: view.input.structure, 
        instanceKey, types: view.input.inputCollections ?? []});
    const datastore = new TriggerDatastore(siloKey, collections, await pGlobals);
    await view.trigger({siloKey, structureKey, instanceKey, key, value, datastore});
    await datastore.commitDataAsync();
}

async function runTriggersApi({siloKey, structureKey, instanceKey, type, key}) {
    const value = await readObjectAsync({siloKey, structureKey, instanceKey, collection: type, key});
    const derived_views = getDerivedViews();
    const triggers = derived_views.filter(dv => dv.input.structure === structureKey && dv.input.triggerType === type);
    await Promise.all(triggers.map(trigger => 
        runSingleTriggerAsync({view: trigger, siloKey, structureKey, instanceKey, key, value})))
    return {success: true}
}
exports.runTriggersApi = runTriggersApi;

exports.apiFunctions = {
    runTriggers: runTriggersApi
}
