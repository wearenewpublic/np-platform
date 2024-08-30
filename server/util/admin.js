
async function getIsUserAdminAsync({serverstore}) {
    const userEmail = serverstore.getUserEmail();
    const adminEmails = await serverstore.getModulePublicAsync('admin', 'adminEmails');

    const emailDomain = userEmail?.split('@')[1];
    const isTest = process.env.NODE_ENV == 'test';
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

    if (adminEmails?.includes(userEmail) || ((isTest || isEmulator) && emailDomain == 'admin.org')) {
        return true;
    } else {
        return false;
    }
}

exports.getIsUserAdminAsync = getIsUserAdminAsync;

function checkIsGlobalAdmin(serverstore) {
    const userEmail = serverstore.getUserEmail();
    const emailDomain = userEmail.split('@')[1];
    if (emailDomain == 'newpublic.org' || emailDomain == 'admin.org') {
        return true;
    }
    throw new Error('Not authorized as global admin: ' + emailDomain);
}
exports.checkIsGlobalAdmin = checkIsGlobalAdmin;
