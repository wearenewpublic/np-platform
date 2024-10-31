const { stringToFbKey, fbKeyToString, getUserByEmailAsync } = require("../util/firebaseutil");
const { getGptJsonAsync } = require('./chatgpt');

async function addVerifiedUsersAsync({serverstore, emails}) {
    const emailList = extractEmailsFromString(emails) || [];
    const encodedEmails = emailList.map(email => stringToFbKey(email.toLowerCase()));
    const currentList = await serverstore.getModulePrivateAsync('verify', ['verifiedUsers']) || [];
    const updatedList = Array.from(new Set([...currentList, ...encodedEmails]));
    await serverstore.setModulePrivate('verify', ['verifiedUsers'], updatedList);
    await serverstore.commitDataAsync();
    for (const email of emailList) {
        await setVerficationStatusOnPersonaAsync({serverstore, email});
    }
}
exports.addVerifiedUsersAsync = addVerifiedUsersAsync;

function extractEmailsFromString(input) {
    const emailRegex = /[\w.-]+@[\w.-]+\.[\w]{2,}/g;
    return input.match(emailRegex);
}

async function getVerifiedUsersAsync({serverstore}) {
    const verifiedUsers = await serverstore.getModulePrivateAsync('verify', ['verifiedUsers']) || [];
    return verifiedUsers.map(user => {
        return fbKeyToString(user);
    });
}
exports.getVerifiedUsersAsync = getVerifiedUsersAsync;

async function getIsCelebrityAsync({serverstore, name}) {
    const result = await getGptJsonAsync({promptKey: 'celebrity_name_check', params: {name}})
    return result.isCelebrity
}
exports.getIsCelebrityAsync = getIsCelebrityAsync;

async function setVerficationStatusOnPersonaAsync({serverstore, email}) {
    const verifiedUsers = await serverstore.getModulePrivateAsync('verify', ['verifiedUsers']) || [];
    const encodedEmail = stringToFbKey(email.toLowerCase());
    const verificationStatus = verifiedUsers.includes(encodedEmail) ? "verified" : "unverified";

    const userRecord = await getUserByEmailAsync(email);    
    const path = {structureKey: 'profile', instanceKey: userRecord.uid}
    const oldPreview = await serverstore.getRemoteGlobalAsync({...path, key: 'preview', });
    serverstore.setRemoteGlobal(
        {...path, key: 'preview', value: { ...oldPreview, verificationStatus}});
    serverstore.updateRemoteObject(
        {...path, type: 'persona', key: userRecord.uid, updateMap: {verificationStatus}});

    return verificationStatus;
}
exports.setVerficationStatusOnPersonaAsync = setVerficationStatusOnPersonaAsync;

exports.adminFunctions = {
    addVerifiedUsers: addVerifiedUsersAsync,
    getVerifiedUsers: getVerifiedUsersAsync,
}

exports.publicFunctions = {
    getIsCelebrity: getIsCelebrityAsync,
    setVerficationStatusOnPersona: setVerficationStatusOnPersonaAsync,
}
