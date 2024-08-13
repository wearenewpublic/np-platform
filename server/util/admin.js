
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
