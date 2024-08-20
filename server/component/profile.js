
async function updateProfileAsync({serverstore, updates, preview}) {
    if (serverstore.getUserId() != serverstore.getInstanceKey()) {
        throw new Error('Cannot update profile for another user');
    }

    const pOldPreview = serverstore.getGlobalPropertyAsync('preview');
    const pOldModuleData = serverstore.getGlobalPropertyAsync('fields');
    const pBacklinks = serverstore.getCollectionAsync('backlink');

    const oldPreview = await pOldPreview || {};
    const oldModuleData = await pOldModuleData || {};
    const backlinks = await pBacklinks || [];

    serverstore.setGlobalProperty('preview', {...oldPreview, ...preview});
    serverstore.setGlobalProperty('fields', {...oldModuleData, ...updates});

    if (!isSelfInBacklinks({serverstore, backlinks})) {
        serverstore.updateObject('persona', serverstore.getUserId(), preview);
    }

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

function isSelfInBacklinks({serverstore, backlinks}) {
    return backlinks.find(backlink => 
        backlink.structureKey == 'persona' && backlink.instanceKey == serverstore.getUserId()
    );
}

function setPersonaPreviewForInstance({serverstore, structureKey, instanceKey, preview}) {
    serverstore.updateRemoteObject({
        structureKey, instanceKey, 
        type: 'persona', key: serverstore.getUserId(),
        updateMap: preview
    });
}

async function linkInstanceAsync({serverstore}) {
    const persona = await serverstore.getPersonaAsync(serverstore.getUserId());
    serverstore.addPersonaToInstance({
        structureKey: serverstore.getStructureKey(),
        instanceKey: serverstore.getInstanceKey(),
        personaKey: serverstore.getUserId(),
        persona
    }); 
    return null;
}
exports.linkInstanceAsync = linkInstanceAsync;

exports.publicFunctions = {
    update: updateProfileAsync,
    linkInstance: linkInstanceAsync,
}
