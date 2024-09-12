import { gotoUrl, replaceUrl } from "./url";
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

function makeQueryForParams(index, params, query=new URLSearchParams()) {
    console.log('makeQueryForParams', index, params, query);
    for (const [key, value] of Object.entries(params ?? {})) {
        if (value) {
            query.set(key + getParamSuffixForIndex(index), value);
        }
    }
    return query;
}

export function pushSubscreen(screenKey, params = {}) {
    const parts = window.location.pathname.split('/').filter(x => x).slice(1);
    parts.push(screenKey);
    const parentQuery = new URLSearchParams(window.location.search);

    const query = makeQueryForParams(parts.length - 2, params, parentQuery);

    gotoUrl(makeUrl(parts, query));
}

export function gotoInstance({structureKey, instanceKey, params}) {
    console.log('gotoInstance', structureKey, instanceKey, params);
    const query = makeQueryForParams(0, params);
    gotoUrl(makeUrl([structureKey, instanceKey], query));
}

export function gotoInstanceScreen({structureKey, instanceKey, screenKey, params}) {
    const parts = [structureKey, instanceKey, screenKey];
    const query = makeQueryForParams(1, params);
    gotoUrl(makeUrl(parts, query));
}

export function replaceInstance({structureKey, instanceKey}) {
    replaceUrl(makeUrl([structureKey, instanceKey]));
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
    url.pathname = siloKey + '/' + parts.join('/');
    url.search = query.toString();
    return url.toString();
}

function getParamSuffixForIndex(index) {
    return index ? ('' + index) : '';
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
    var [siloKey, structureKey, instanceKey, ...subScreenParts] = parts;
    const screenParts = [null, ...subScreenParts];

    if (!structureKey) return {}
    if (!instanceKey) return {structureKey};

    // var screenStack = [{siloKey, structureKey, instanceKey, screenKey: null, params: {}}];
    var screenStack = [];

    for (var i = 0; i < screenParts.length; i++) {
        const screenKey = screenParts[i];
        const params = getParamsWithSuffix(query, getParamSuffixForIndex(i));
        screenStack.push({siloKey, structureKey, instanceKey, screenKey, params});
    }
    screenStack = removeInvisibleParentsFromScreenStack(screenStack);
    return {siloKey, structureKey, instanceKey, screenStack};
}
