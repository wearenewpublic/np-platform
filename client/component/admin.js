import { useDatastore, useModulePublicData } from "../util/datastore";
import { useFirebaseData, useFirebaseUser } from "../util/firebase";
import { getIsLocalhost } from "../platform-specific/url";
import { useContext } from 'react';
import { InstanceContext } from "../organizer/InstanceContext";

export function useIsAdmin() {
    const {isAdmin} = useContext(InstanceContext);
    return isAdmin;
}

export function useIsAdminForSilo({siloKey}) {
    const fbUser = useFirebaseUser();
    const adminEmails = useFirebaseData(['silo', siloKey, 'module-public', 'admin', 'adminEmails'])?.toLowerCase(); 
    const email = fbUser?.email?.toLowerCase();
    const emailDomain = email?.split('@')?.[1];

    const isAdmin = (email && adminEmails?.includes(email)) || (getIsLocalhost() && emailDomain == 'admin.org');
    return isAdmin;
}