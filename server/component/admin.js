import {getOrCreateUserAsync, firebaseGetUserAsync, stringToFbKey, fbKeyToString} from "../util/firebaseutil";

function extractEmailsFromString(input) {
    const emailRegex = /[\w.-]+@[\w.-]+\.[\w]{2,}/g;
    return input.match(emailRegex);
  }

async function addAdminUsersAsync({serverstore, emails, roles}) {
    const emailList = extractEmailsFromString(emails);
    emailList.forEach(email => {
        serverstore.setModulePrivate('admin', ['userRoles', stringToFbKey(email.toLowerCase())], JSON.stringify(roles));
    });
}
export {addAdminUsersAsync};

async function setAdminRolesAsync({serverstore, email, roles}) {
    serverstore.setModulePrivate('admin', ['userRoles', stringToFbKey(email.toLowerCase())], JSON.stringify(roles));
}
export {setAdminRolesAsync};

async function getAdminUsersAsync({serverstore}) {
    const userRoles = await serverstore.getModulePrivateAsync('admin', ['userRoles']);
    const userKeys = Object.keys(userRoles ?? {});

    return userKeys.map(key => {
        const roles = JSON.parse(userRoles[key] ?? '[]');
        return {key, roles, email: fbKeyToString(key)};
    });
}
export {getAdminUsersAsync};

async function getMyRolesAsync({serverstore, email}) {
    const userRoles = await serverstore.getModulePrivateAsync('admin', ['userRoles', stringToFbKey(email.toLowerCase())]);
    return JSON.parse(userRoles ?? '[]');
}

export var publicFunctions = {
    getMyRoles: getMyRolesAsync
};

export var adminFunctions = {
    addAdminUsers: addAdminUsersAsync,
    setAdminRoles: setAdminRolesAsync,
    getAdminUsers: getAdminUsersAsync
};

export default {publicFunctions, adminFunctions};
