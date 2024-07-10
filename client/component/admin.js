import { useModulePublicData } from "../util/datastore";
import { useFirebaseUser } from "../util/firebase";
import { getIsLocalhost } from "../platform-specific/url";

export function useIsAdmin() {
    const fbUser = useFirebaseUser();
    const email = fbUser?.email.toLowerCase();
    const adminEmails = useModulePublicData('admin',['adminEmails']).toLowerCase();
    const emailDomain = email?.split('@')[1];
    return adminEmails?.includes(email) || (getIsLocalhost() && emailDomain == 'admin.org');
}

