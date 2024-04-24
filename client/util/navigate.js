import { gotoUrl, replaceUrl } from "../organizer/url";
import { stripSuffix } from "./util";


export function closeSidebar() {
    if (window.parent) {
        window.parent.postMessage('psi-close-sidebar', '*');
    }
}

export function openSidebar() {
    if (window.parent) {
        window.parent.postMessage('psi-open-sidebar', '*');
    }
}

export function goBack() {
    history.back();
}

export function pushSubscreen(key, params = {}) {
    const parts = window.location.pathname.split('/').filter(x => x).slice(1);
    const query = new URLSearchParams(window.location.search);
    parts.push(key);
    const index = parts.length - 3;

    for (const [key, value] of Object.entries(params)) {
        if (value) {
            query.set(key + getParamSuffixForIndex(index), value);
        }
    }

    gotoUrl(makeUrl(parts, query));
}

export function gotoLogin() {
    pushSubscreen('login');
}

export function gotoStructure(structureKey) {
    gotoUrl(makeUrl([structureKey]));
}

export function makeStructureUrl(structureKey) {
    return makeUrl([structureKey]);
}

export function gotoInstance({structureKey, instanceKey}) {
    gotoUrl(makeUrl([structureKey, instanceKey]));
}

export function replaceInstance({structureKey, instanceKey}) {
    replaceUrl(makeUrl([structureKey, instanceKey]));
}


function removeParamsWithSuffix(urlParams, suffix) {
    for(let [key, value] of urlParams) {
        if(key.endsWith(suffix)) {
            urlParams.delete(key);
        }
    }
}

function getParamsWithSuffix(urlParams, suffix) {
    const result = {};
    for(let [key, value] of urlParams) {
        if (suffix) {
            if(key.endsWith(suffix)) {
                result[stripSuffix(key, suffix)] = value;
            }
        } else {
            if(!key.includes('_')) {
                result[key] = value;
            }
        }
    }
    return result;
}


export function makeUrl(parts, query = new URLSearchParams()) {
    const url = new URL(window.location.href);
    const currentParts = url.pathname.split('/').filter(x => x);
    const siloKey = currentParts[0] || 'global';
    url.pathname = siloKey + '/' + parts.map(encodeURIComponent).join('/');
    url.search = query.toString();
    return url.toString();
}

function getParamSuffixForIndex(index) {
    return index ? ('_' + index) : '';
}


function removeInvisibleParentsFromScreenStack(screenStack) {
    for (var i = 0; i < screenStack.length; i++) {
        const screen = screenStack[i];
        if (screen.screenKey == 'teaser') {
            return screenStack.slice(1);
        }
    }
    return screenStack;
}


export function getScreenStackForUrl(url) {
    const parsedUrl = new URL(url);
    const parts = parsedUrl.pathname.split('/').filter(x => x);
    const query = new URLSearchParams(parsedUrl.search);
    var [siloKey, structureKey, instanceKey, ...screenParts] = parts;

    if (!structureKey) return {}
    if (!instanceKey) return {structureKey};

    var screenStack = [{siloKey, structureKey, instanceKey, screenKey: null, params: {}}];

    for (var i = 0; i < screenParts.length; i++) {
        const screenKey = screenParts[i];
        const params = getParamsWithSuffix(query, getParamSuffixForIndex(i));
        screenStack.push({siloKey, structureKey, instanceKey, screenKey, params});
    }
    screenStack = removeInvisibleParentsFromScreenStack(screenStack);
    return {siloKey, structureKey, instanceKey, screenStack};
}
