
async function updateProfileAsync({serverstore, updates, preview}) {
    const pOldPreview = serverstore.getGlobalPropertyAsync('preview');
    const pOldModuleData = serverstore.getGlobalPropertyAsync('fields');
    const pBacklinks = serverstore.getCollectionAsync('backlink');

    const oldPreview = await pOldPreview || {};
    const oldModuleData = await pOldModuleData || {};
    const backlinks = await pBacklinks || [];

    serverstore.setGlobalProperty('preview', {...oldPreview, ...preview});
    serverstore.setGlobalProperty('fields', {...oldModuleData, ...updates});
    serverstore.updateObject('persona', serverstore.getUserId(), preview);

    backlinks.forEach(backlink => {
        const {structureKey, instanceKey} = backlink;
        setPersonaPreviewForInstance({serverstore, structureKey, instanceKey, preview});
    })

    return null;
}

function setPersonaPreviewForInstance({serverstore, structureKey, instanceKey, preview}) {
    serverstore.updateRemoteObject({
        structureKey, instanceKey, 
        type: 'persona', key: serverstore.getUserId(),
        updateMap: preview
    });
}

async function linkInstanceAsync({serverstore}) {
    const userId = serverstore.getUserId();
    serverstore.updateObject('persona', userId, {linked: true});
    serverstore.setGenericBacklink('profile', userId);
    return null;
}

exports.publicFunctions = {
    update: updateProfileAsync,
    linkInstance: linkInstanceAsync,
}
