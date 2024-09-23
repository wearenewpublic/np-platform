import { useDatastore, useIsLive, useMyRoles } from "../util/datastore";
import { useFirebaseData, useFirebaseUser } from "../util/firebase";
import { getIsLocalhost } from "../platform-specific/url";
import { Banner } from "./banner";
import { UtilityText } from "./text";
import { ConversationScreen } from "./basics";
import { roles } from "../feature";

export var global_capability_map = {};


export function useIsAdmin() {
    const localHostAdmin = useIsLocalhostAdmin();
    const roles = useMyRoles();
    return localHostAdmin || (roles && roles.length > 0)
}

export function useIsLocalhostAdmin() {
    const fbUser = useFirebaseUser();
    const isLive = useIsLive();
    if (!fbUser || !isLive) { return false }
    const emailDomain = fbUser.email.split('@')?.[1];
    return getIsLocalhost() && emailDomain === 'admin.org';
}

export function useIsAdminForSilo({siloKey}) {
    const localHostAdmin = useIsLocalhostAdmin();
    const fbUser = useFirebaseUser();
    const adminEmails = useFirebaseData(['silo', siloKey, 'module-public', 'admin', 'adminEmails'])?.toLowerCase(); 
    const email = fbUser?.email?.toLowerCase();

    return localHostAdmin || (email && adminEmails?.includes(email));
}


export function useHasCapability(capability) {
    const roles = useMyRoles();
    const localHostAdmin = useIsLocalhostAdmin();

    if (localHostAdmin) {
        return true;
    }
    if (!roles) {
        return null;
    }

    for (let role of roles) {
        if (role === 'Owner') {
            return true;
        }
        if (global_capability_map?.[role]?.[capability]) {
            return true;
        }
    }
    return false;
}

export function RestrictedScreen({capability, pad, children}) {
    const hasCapability = useHasCapability(capability);
    if (hasCapability === null) {
        return null;
    }
    if (!hasCapability) {
        return <Banner><UtilityText label='You do not have access to this feature'/></Banner>
    }
    return <ConversationScreen pad={pad}>{children}</ConversationScreen>;
}


export function makeCapabilityMap(roles) {
    var capability_map = {};
    Object.keys(roles).forEach(roleKey => {
        const role = roles[roleKey];
        if (!capability_map[roleKey]) {
            capability_map[roleKey] = {};
        }
        role?.can?.forEach(capability => {
            capability_map[roleKey][capability] = true;
        });
        if (role.inherits) {
            role.inherits.forEach(inheritedRoleKey => {
                const inheritedRole = roles[inheritedRoleKey];
                inheritedRole?.can?.forEach(capability => {
                    if (!capability_map[roleKey]) {
                        capability_map[roleKey] = {};
                    }
                    capability_map[roleKey][capability] = true;
                });
            });
        }
    });
    return capability_map;
}

export function getRoles() {
    return roles;
}

export function extendRoles(newRoles) {
    Object.keys(newRoles).forEach(roleKey => {
        const newRole = newRoles[roleKey];
        if (roles[roleKey]) {
            const oldRole = roles[roleKey];
            roles[roleKey].can = [
                ... oldRole.can ?? [], 
                ... newRole.can ?? []
            ]
        } else {
            roles[roleKey] = newRoles
        }
    })
    global_capability_map = makeCapabilityMap(roles);
}
