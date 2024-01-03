const { derived_views } = require("../derived-views");
const { firebaseUpdateAsync, readMultipleCollectionsAsync, readObjectAsync } = require("../util/firebaseutil");

class TriggerDatastore{
    output = {};

    constructor(collections) {
        this.collections = collections;
    }

    getCollection(type) {
        const collection = this.collections[type];
        const keys = Object.keys(collection || {});
        return keys.map(key => collection[key]);
    }

    setObject({prototypeKey, instanceKey, type, key, value}) {
        this.output['prototype/' + prototypeKey + '/instance/' + instanceKey + '/collection/' + type + '/' + key] = value;     
    }
    
    async commitDataAsync() {
        console.log('commitDataAsync', this.output);
        return await firebaseUpdateAsync('/', this.output);
    }
}
exports.TriggerDatastore = TriggerDatastore;


async function runSingleTriggerAsync({view, prototypeKey, instanceKey, key, value}) {
    console.log('runSingleTrigger', view);
    const collections = await readMultipleCollectionsAsync({
        prototype: view.input.prototype, 
        instance: instanceKey, types: view.input.inputCollections});
    // console.log('collections', collections);
    const datastore = new TriggerDatastore(collections);
    view.trigger({prototypeKey, instanceKey, key, value, datastore});
    await datastore.commitDataAsync();
}

async function runDerivedViewTriggersAsync({prototypeKey, instanceKey, type, key, value}) {
    // console.log('Run Triggers Async', {prototypeKey, type});    
    // console.log('all triggers', derived_views);
    const triggers = derived_views.filter(dv => dv.input.prototype === prototypeKey && dv.input.triggerType === type);
    // console.log('triggers matched', triggers);
    await Promise.all(triggers.map(trigger => 
        runSingleTriggerAsync({view: trigger, prototypeKey, instanceKey, key, value})))
    return {success: true}
}

exports.runDerivedViewTriggersAsync = runDerivedViewTriggersAsync;


async function runTriggersAsync({prototypeKey, instanceKey, type, key}) {
    const value = await readObjectAsync({prototype: prototypeKey, instance: instanceKey, collection: type, key});
    return await runDerivedViewTriggersAsync({prototypeKey, instanceKey, type, key, value});
}

exports.apiFunctions = {
    runTriggers: runTriggersAsync
}