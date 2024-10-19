import {stringToFbKey} from "./firebaseutil";

export async function getIsUserAdminAsync({serverstore}) {
    const userEmail = serverstore.getUserEmail();
    const emailKey = stringToFbKey(userEmail.toLowerCase());
    const myRoles = await serverstore.getModulePrivateAsync('admin', ['userRoles', emailKey]);

    const emailDomain = userEmail?.split('@')[1];
    const isTest = process.env.NODE_ENV == 'test';
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
    const isTestAdmin = (isTest || isEmulator) && emailDomain == 'admin.org';

    return (myRoles?.length > 0 || isTestAdmin);
}

export function checkIsGlobalAdmin(serverstore) {
    const userEmail = serverstore.getUserEmail();
    const emailDomain = userEmail.split('@')[1];
    if (emailDomain == 'newpublic.org' || emailDomain == 'admin.org') {
        return true;
    }
    throw new Error('Not authorized as global admin: ' + emailDomain);
}
