import {getDerivedViews} from "../derived-views";

async function runTriggersApi({serverstore, type, key}) {
    const {siloKey, structureKey, instanceKey} = serverstore.getProps();

    const value = await serverstore.getObjectAsync(type, key);
    const derivedViews = getDerivedViews();
    const matchingViews = derivedViews.filter(dv => dv.input.structure === structureKey && dv.input.triggerType === type);
    await Promise.all(matchingViews.map(view => 
        view.trigger({serverstore, key, value, siloKey, structureKey, instanceKey})
    ))
}
export {runTriggersApi};

export var publicFunctions = {
    runTriggers: runTriggersApi
};

export default {publicFunctions}