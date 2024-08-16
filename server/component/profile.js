
async function updateProfileAsync({serverstore, moduleKey, updates, preview}) {
    const pOldPreview = serverstore.getGlobalPropertyAsync('preview');
    const oldModuleData = await serverstore.getGlobalPropertyAsync(moduleKey) || {};
    const oldPreview = await pOldPreview || {};
    console.log('updateProfileAsync', updates, preview);

    serverstore.setGlobalProperty('preview', {...oldPreview, ...preview});
    serverstore.setGlobalProperty(moduleKey, {...oldModuleData, ...updates});
    return null;
}

exports.publicFunctions = {
    update: updateProfileAsync
}
