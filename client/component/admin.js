import { useModulePublicData } from "../util/datastore";
import { useFirebaseUser } from "../util/firebase";
import { getIsLocalhost } from "../platform-specific/url";

export function useIsAdmin() {
    const fbUser = useFirebaseUser();
    const adminEmails = useModulePublicData('admin',['adminEmails'])?.toLowerCase();

    const email = fbUser?.email?.toLowerCase();
    const emailDomain = email?.split('@')?.[1];
    return (email && adminEmails?.includes(email)) || (getIsLocalhost() && emailDomain == 'admin.org');
}

