
async function profileConstructorAsync({serverstore}) {
    const userId = serverstore.getInstanceKey();
    const persona = await serverstore.getPersonaAsync(userId);

    serverstore.setObject('persona', userId, persona);
    serverstore.setGlobalProperty('preview', persona);
    serverstore.setGlobalProperty('fields', persona);
}
exports.profileConstructorAsync = profileConstructorAsync;
