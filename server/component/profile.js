
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

    if (preview.name && updates.nameMode == 'custom') {
        serverstore.setModulePublic('profile', ['pseudonym', preview.name], serverstore.getUserId());
        if (oldPreview.name) {
            serverstore.setModulePublic('profile', ['pseudonym', oldPreview.name], null);
        }
    }

    backlinks.forEach(backlink => {
        const {structureKey, instanceKey} = backlink;
        setPersonaPreviewForInstance({serverstore, structureKey, instanceKey, preview});
    })

    return null;
}
exports.updateProfileAsync = updateProfileAsync;

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
exports.linkInstanceAsync = linkInstanceAsync;

exports.publicFunctions = {
    update: updateProfileAsync,
    linkInstance: linkInstanceAsync,
}
