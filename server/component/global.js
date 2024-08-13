
async function setGlobalPropertyApi({serverstore, key, value}) {
    await serverstore.setGlobalPropertyAsync(key, value);
}
exports.setGlobalPropertyApi = setGlobalPropertyApi;
    
exports.adminFunctions = {
    setGlobalProperty: setGlobalPropertyApi
}