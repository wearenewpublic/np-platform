
async function setGlobalPropertyApi({serverstore, key, value}) {
    serverstore.setGlobalProperty(key, value);
}
export {setGlobalPropertyApi};

export var adminFunctions = {
    setGlobalProperty: setGlobalPropertyApi
};

export default {adminFunctions};
