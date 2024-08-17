
async function updateProfileAsync({serverstore, moduleKey, updates, preview}) {
    const pOldPreview = serverstore.getGlobalPropertyAsync('preview');
    const oldModuleData = await serverstore.getGlobalPropertyAsync('fields') || {};
    const oldPreview = await pOldPreview || {};
    console.log('updateProfileAsync', updates, preview);

    serverstore.setGlobalProperty('preview', {...oldPreview, ...preview});
    serverstore.setGlobalProperty('fields', {...oldModuleData, ...updates});
    serverstore.updateObject('persona', serverstore.getUserId(), preview);
    return null;
}

// function setPersonaPreviewForInstance({serverstore, structureKey, instanceKey, preview}) {
//     serverstore.updateRemoteObject({
//         structureKey, instanceKey, key: 'preview', value: preview
//     });
// }

async function linkInstanceAsync({serverstore}) {
    const userId = serverstore.getUserId();
    serverstore.modifyObject('persona', userId, {linked: true});
    serverstore.setGenericBacklink('persona', userId);
    return null;
}

exports.publicFunctions = {
    update: updateProfileAsync,
    linkInstance: linkInstanceAsync,
}
