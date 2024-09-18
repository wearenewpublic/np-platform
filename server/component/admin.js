const { getOrCreateUserAsync, firebaseGetUserAsync } = require("../util/firebaseutil");

function extractEmailsFromString(input) {
    const emailRegex = /[\w.-]+@[\w.-]+\.[\w]{2,}/g;
    return input.match(emailRegex);
  }

async function addAdminUsersAsync({serverstore, emails, roles}) {
    const emailList = extractEmailsFromString(emails);
    const userRecords = await Promise.all(emailList.map(email => 
        getOrCreateUserAsync({email})
    ));

    userRecords.forEach(userRecord => {
        serverstore.setModulePrivate('admin', ['userRoles', userRecord.uid], JSON.stringify(roles));
    });
}
exports.addAdminUsersAsync = addAdminUsersAsync;

async function setAdminRolesAsync({serverstore, adminKey, roles}) {
    serverstore.setModulePrivate('admin', ['userRoles', adminKey], JSON.stringify(roles));
}
exports.setAdminRolesAsync = setAdminRolesAsync;

async function getAdminUsersAsync({serverstore}) {
    const userRoles = await serverstore.getModulePrivateAsync('admin', ['userRoles']);
    const userKeys = Object.keys(userRoles);
    const userPersonas = await Promise.all(userKeys.map(uid => serverstore.getPersonaAsync(uid)));
    const userRecords = await Promise.all(userKeys.map(uid => firebaseGetUserAsync(uid))); 

    return userPersonas.map(userPersona => {
        const userRecord = userRecords.find(userRecord => userRecord.uid === userPersona.key);
        const roles = JSON.parse(userRoles[userPersona.key] ?? '[]');
        return {...userPersona, roles, email: userRecord.email};
    });
}
exports.getAdminUsersAsync = getAdminUsersAsync;


exports.adminFunctions = {
    addAdminUsers: addAdminUsersAsync,
    setAdminRoles: setAdminRolesAsync,
    getAdminUsers: getAdminUsersAsync
}
