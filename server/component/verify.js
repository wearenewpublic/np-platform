const { stringToFbKey, fbKeyToString, getUserByEmailAsync } = require("../util/firebaseutil");
const { getGptJsonAsync } = require('./chatgpt');
const { updateProfileAsync } = require('./profile');

async function addVerifiedUsersAsync({serverstore, emails}) {
    const emailList = extractEmailsFromString(emails) || [];
    const encodedEmails = emailList.map(email => stringToFbKey(email.toLowerCase()));
    const currentList = await serverstore.getModulePrivateAsync('verify', ['verifiedUsers']) || [];
    const updatedList = Array.from(new Set([...currentList, ...encodedEmails]));
    await serverstore.setModulePrivate('verify', ['verifiedUsers'], updatedList);
    await serverstore.commitDataAsync();
    for (const email of emailList) {
        const userRecord = await getUserByEmailAsync(email);
        if (userRecord) {
            await updateProfileVerificationStatusAsync({serverstore, email, userId: userRecord.uid});
        }
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

async function getVerificationStatusAsync({serverstore, email}) {
    const verifiedUsers = await serverstore.getModulePrivateAsync('verify', ['verifiedUsers']) || [];
    const encodedEmail = stringToFbKey(email.toLowerCase());
    return verifiedUsers.includes(encodedEmail) ? "verified" : "unverified";
}
exports.getVerificationStatusAsync = getVerificationStatusAsync;

async function updateProfileVerificationStatusAsync({serverstore, email, userId}) {
    const verificationStatus = await getVerificationStatusAsync({serverstore, email});
    const remoteStore = serverstore.getRemoteStore({
        structureKey: 'profile', instanceKey: userId, userId, userEmail: email});
    const oldPreview = await remoteStore.getGlobalPropertyAsync('preview');
    const updatedPreview = { ...oldPreview, verificationStatus };
    await updateProfileAsync({
        serverstore: remoteStore, updates: {}, preview: updatedPreview});
    return verificationStatus;
}

async function setVerificationStatusAsync({serverstore}) {
    const userEmail = serverstore.getUserEmail();
    return await updateProfileVerificationStatusAsync({
        serverstore, email: userEmail, userId: serverstore.getUserId()});
}
exports.setVerificationStatusAsync = setVerificationStatusAsync;

exports.adminFunctions = {
    addVerifiedUsers: addVerifiedUsersAsync,
    getVerifiedUsers: getVerifiedUsersAsync,
}

exports.publicFunctions = {
    getIsCelebrity: getIsCelebrityAsync,
    setVerficationStatus: setVerificationStatusAsync,
}
