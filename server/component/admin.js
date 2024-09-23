const { getOrCreateUserAsync, firebaseGetUserAsync, stringToFbKey, fbKeyToString } = require("../util/firebaseutil");

function extractEmailsFromString(input) {
    const emailRegex = /[\w.-]+@[\w.-]+\.[\w]{2,}/g;
    return input.match(emailRegex);
  }

async function addAdminUsersAsync({serverstore, emails, roles}) {
    const emailList = extractEmailsFromString(emails);
    emailList.forEach(email => {
        serverstore.setModulePrivate('admin', ['userRoles', stringToFbKey(email)], JSON.stringify(roles));
    });
}
exports.addAdminUsersAsync = addAdminUsersAsync;

async function setAdminRolesAsync({serverstore, email, roles}) {
    serverstore.setModulePrivate('admin', ['userRoles', stringToFbKey(email)], JSON.stringify(roles));
}
exports.setAdminRolesAsync = setAdminRolesAsync;

async function getAdminUsersAsync({serverstore}) {
    const userRoles = await serverstore.getModulePrivateAsync('admin', ['userRoles']);
    const userKeys = Object.keys(userRoles ?? {});

    return userKeys.map(key => {
        const roles = JSON.parse(userRoles[key] ?? '[]');
        return {key, roles, email: fbKeyToString(key)};
    });
}
exports.getAdminUsersAsync = getAdminUsersAsync;

async function getMyRolesAsync({serverstore, email}) {
    const userRoles = await serverstore.getModulePrivateAsync('admin', ['userRoles', stringToFbKey(email)]);
    return JSON.parse(userRoles ?? '[]');
}

exports.publicFunctions = {
    getMyRoles: getMyRolesAsync
}

exports.adminFunctions = {
    addAdminUsers: addAdminUsersAsync,
    setAdminRoles: setAdminRolesAsync,
    getAdminUsers: getAdminUsersAsync
}
