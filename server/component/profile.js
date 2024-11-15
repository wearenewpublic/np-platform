const {getGptJsonAsync} = require('./chatgpt');

async function updateProfileAsync({serverstore, updates, preview}) {
    if (serverstore.getUserId() != serverstore.getInstanceKey()) {
        throw new Error('Cannot update profile for another user');
    }

    const pOldPreview = serverstore.getGlobalPropertyAsync('preview');
    const pOldModuleData = serverstore.getGlobalPropertyAsync('fields');
    const pBacklinks = serverstore.getCollectionAsync('backlink');
    const pFirstLogin = serverstore.getGlobalPropertyAsync('firstLogin');

    const oldPreview = await pOldPreview || {};
    const oldModuleData = await pOldModuleData || {};
    const backlinks = await pBacklinks || [];
    const firstLogin = await pFirstLogin || Date.now();

    serverstore.setGlobalProperty('preview', {...oldPreview, ...preview});
    serverstore.setGlobalProperty('fields', {...oldModuleData, ...updates});
    serverstore.setGlobalProperty('firstLogin', firstLogin);

    if (!isSelfInBacklinks({serverstore, backlinks})) {
        serverstore.updateObject('persona', serverstore.getUserId(), preview);
    }

    if (preview.name && updates.nameMode == 'custom' && preview.name != oldPreview.name) {
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

async function checkNameAsync({serverstore, name}) {
    if (name.length < 3) {
        return {violates: true, message: 'Name must be at least 3 characters'};
    } else if (name.length > 50) {
        return {violates: true, message: 'Name must be 50 characters or less'};
    } else if (name.match(/[^a-z0-9]/)) {
        return {violates: true, message: 'Name can only contain letters and numbers'};
    }
    const gptResult = await getGptJsonAsync({
        promptKey: 'name_check', 
        language: serverstore.getLanguage(),
        params: {name}
    });
    if (gptResult.violates) {
        return {violates: true};
    }
    const result2 = await getGptJsonAsync({
        promptKey: 'name_looks_real', 
        language: serverstore.getLanguage(),
        params: {name}
    });
    if (result2.resembles_full_name) {
        return {violates: true, looksreal: true};
    }

    return {violates: false};
}
exports.checkNameAsync = checkNameAsync;

exports.publicFunctions = {
    update: updateProfileAsync,
    linkInstance: linkInstanceAsync,
    checkName: checkNameAsync
}
