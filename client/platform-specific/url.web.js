import { useConfig } from "../util/features";

export function historyPushState({state, url}) {
    history.pushState(state, '', url);
}

export function historyReplaceState({state, url}) {
    history.replaceState(state, '', url);
}

export function historyGetState() {
    return history.state;
}
 

export function watchPopState(callback) {
    window.addEventListener('popstate', event => callback(event.state));
}

export function getIsLocalhost() {
    const commonLocalHosts = `localhost|192\\.168\\.\\d{1,3}\\.\\d{1,3}|${process.env.REACT_APP_PSI_LOCAL_IP}`;
    return new RegExp(commonLocalHosts).test(location.hostname);
}

export function setTitle(title) {
    window.document.title = title;
}

export function WebLinkBase({url, children}) {
    const { openLinksInNewTab } = useConfig();
    const target = openLinksInNewTab ? '_blank' : '_parent';

    return <a href={url} target={target} rel='noreferrer'>{children}</a>;
}
