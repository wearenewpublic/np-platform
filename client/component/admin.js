import { useDatastore, useMyRoles } from "../util/datastore";
import { useFirebaseData, useFirebaseUser } from "../util/firebase";
import { getIsLocalhost } from "../platform-specific/url";
import { callServerApiAsync, useServerCallResult } from "../util/servercall";
import { useEffect, useState } from "react";

export function useIsAdmin() {
    const datastore = useDatastore();
    return datastore.getIsAdmin();
}

export function useIsAdminForSilo({siloKey}) {
    const fbUser = useFirebaseUser();
    const adminEmails = useFirebaseData(['silo', siloKey, 'module-public', 'admin', 'adminEmails'])?.toLowerCase(); 
    const email = fbUser?.email?.toLowerCase();
    const emailDomain = email?.split('@')?.[1];

    const isAdmin = (email && adminEmails?.includes(email)) || (getIsLocalhost() && emailDomain == 'admin.org');
    return isAdmin;
}


export function useHasCapability(capability) {
    const roles = useMyRoles();

    if (!roles) {
        return null;
    }

    for (let role of roles) {
        if (role === 'Owner') {
            return true;
        }
        if (global_capability_map[role].includes(capability)) {
            return true;
        }
    }
    return false;
}

