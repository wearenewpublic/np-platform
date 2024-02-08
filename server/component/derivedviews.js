const { getDerivedViews } = require("../derived-views");
const { firebaseUpdateAsync, readMultipleCollectionsAsync, readObjectAsync, readAllGlobalsAsync } = require("../util/firebaseutil");

class TriggerDatastore{
    // output = {};

    constructor(collections, globals) {
        this.collections = collections;
        this.globals = globals;
        this.output = {};
    }

    getCollection(type) {
        const collection = this.collections[type];
        const keys = Object.keys(collection || {});
        return keys.map(key => collection[key]);
    }

    getGlobal(key) {
        return this.globals[key];
    }

    setDerivedObject({structureKey, instanceKey, type, key, value}) {
        this.output['structure/' + structureKey + '/instance/' + instanceKey + '/collection/derived_' + type + '/' + key] = value;     
    }
    
    async commitDataAsync() {
        console.log('commitDataAsync', this.output);
        return await firebaseUpdateAsync('/', this.output);
    }
}
exports.TriggerDatastore = TriggerDatastore;


async function runSingleTriggerAsync({view, structureKey, instanceKey, key, value}) {
    // console.log('runSingleTrigger', view);
    const pGlobals = await readAllGlobalsAsync({structure: structureKey, instance: instanceKey});
    const collections = await readMultipleCollectionsAsync({
        structure: view.input.structure, 
        instance: instanceKey, types: view.input.inputCollections ?? []});
    const datastore = new TriggerDatastore(collections, await pGlobals);
    await view.trigger({structureKey, instanceKey, key, value, datastore});
    await datastore.commitDataAsync();
}

async function runDerivedViewTriggersAsync({structureKey, instanceKey, type, key, value}) {
    const derived_views = getDerivedViews();
    // console.log('Run Triggers Async', {structureKey, type});    
    // console.log('all triggers', derived_views);
    const triggers = derived_views.filter(dv => dv.input.structure === structureKey && dv.input.triggerType === type);
    // console.log('triggers matched', triggers);
    await Promise.all(triggers.map(trigger => 
        runSingleTriggerAsync({view: trigger, structureKey, instanceKey, key, value})))
    return {success: true}
}

exports.runDerivedViewTriggersAsync = runDerivedViewTriggersAsync;


async function runTriggersAsync({structureKey, instanceKey, type, key}) {
    const value = await readObjectAsync({structure: structureKey, instance: instanceKey, collection: type, key});
    return await runDerivedViewTriggersAsync({structureKey, instanceKey, type, key, value});
}

exports.apiFunctions = {
    runTriggers: runTriggersAsync
}