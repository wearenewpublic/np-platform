const { runGlobalTriggersAsync } = require("./derivedviews");

async function setGlobalPropertyApi({serverstore, key, value}) {
    serverstore.setGlobalProperty(key, value);
    runGlobalTriggersAsync({serverstore, globalKey:key, value});
}
exports.setGlobalPropertyApi = setGlobalPropertyApi;
    
exports.adminFunctions = {
    setGlobalProperty: setGlobalPropertyApi
}