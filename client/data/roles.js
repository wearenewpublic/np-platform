
var roles = {
    Owner: {
        allCapabilities: true,
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


export function getRoles() {
    return roles;
}

export function extendRoles(newRoles) {
    Object.keys(newRoles).forEach(roleKey => {
        const newRole = newRoles[roleKey];
        if (roles[roleKey]) {
            const oldRole = roles[roleKey];
            roles[roleKey].capabilities = [
                ... oldRole.capabilities ?? [], 
                ... newRole.capabilities ?? []
            ]
        } else {
            roles[roleKey] = newRoles
        }
    })
}
