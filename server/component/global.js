const { writeGlobalAsync } = require("np-platform-server/util/firebaseutil");
const { getIsUserAdminAsync } = require("./admin");

async function setGlobalPropertyApi({userEmail, siloKey, structureKey, instanceKey, key, value}) {
    const isAdmin = getIsUserAdminAsync({siloKey,userEmail});
    if (!isAdmin) {
        return {success: false, error: 'Not authorized'};    
    }
    await writeGlobalAsync({siloKey, structureKey, instanceKey, key, value});
    return {success: true, data: true};
}

exports.apiFunctions = {
    setGlobalProperty: setGlobalPropertyApi
}
