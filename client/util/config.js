import { getIsLocalhost } from "../platform-specific/url";

export const appApiDomain = 'https://np-psi-dev.web.app';
export const fileHostDomain = 'https://np-psi-dev.web.app';
export const localHostApiDomain = getIsLocalhost() && `http://${window.location.hostname}:5000`;
export const storagePrefix = 'https://firebasestorage.googleapis.com/v0/b/new-public-demo.appspot.com/o/';

export function emailIsAdmin(email) {
    const host = email.split('@')[1];
    return host == 'newpublic.org';
}
