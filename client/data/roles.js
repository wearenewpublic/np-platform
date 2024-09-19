
export var roles = {
    Owner: {
        allCapabilities: true,
        can: [
            'adminusers/modify-admins'
        ]
    },
    Developer: {
        inherits: ['Editorial', 'Super-Moderator', 'Analyst']
    },
    'Super-Moderator': {
        inherits: ['Moderator']
    },
    Moderator: {
    },
    Editorial: {
    },
    Analyst: {
    }
}

export var global_capability_map = {};

function makeCapabilityMap() {
    Object.keys(roles).forEach(roleKey => {
        const role = roles[roleKey];
        role?.can?.forEach(capability => {
            if (!global_capability_map[roleKey]) {
                global_capability_map[roleKey] = {};
            }
            global_capability_map[roleKey][capability] = true;
        });
        if (role.inherits) {
            roles.inherits.forEach(inheritedRoleKey => {
                const inheritedRole = roles[inheritedRoleKey];
                Object.keys(inheritedRole).forEach(inheritedCapability => {
                    if (!global_capability_map[roleKey]) {
                        global_capability_map[roleKey] = {};
                    }
                    global_capability_map[roleKey][inheritedCapability] = true;
                });
            });
        }
    });
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
    makeCapabilityMap();
}
