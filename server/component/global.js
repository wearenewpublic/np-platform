
async function setGlobalPropertyApi({serverstore, key, value}) {
    serverstore.setGlobalProperty(key, value);
}
exports.setGlobalPropertyApi = setGlobalPropertyApi;
    
exports.adminFunctions = {
    setGlobalProperty: setGlobalPropertyApi
}