const { firebaseReadAsync } = require("../util/firebaseutil");

async function getIsUserAdminAsync({siloKey, userEmail}) {
    console.log('isAdmin env', process.env.NODE_ENV);
    const adminEmails = await firebaseReadAsync(['silo', siloKey, 'module-public', 'admin', 'adminEmails']);
    const emailDomain = userEmail?.split('@')[1];
    if (adminEmails?.includes(userEmail) || emailDomain == 'admin.org') {
        return true;
    } else {
        return false;
    }
}

exports.getIsUserAdminAsync = getIsUserAdminAsync;
