import { stripSuffix } from "./util";
import { useEffect, useState } from "react";
import { historyPushState, historyReplaceState, watchPopState } from "../platform-specific/url";


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
    for (const [key, value] of Object.entries(params ?? {})) {
        if (value) {
            query.set(key + getParamSuffixForIndex(index), value);
        }
    }
    return query;
}
function addGlobalParamsToQuery(globalParams, query) {
    for (const [key, value] of Object.entries(globalParams ?? {})) {
        query.set(key + '_g', value);
    }
}

export function pushSubscreen(screenKey, params = {}) {
    const parts = window.location.pathname.split('/').filter(x => x).slice(1);
    parts.push(screenKey);
    const parentQuery = new URLSearchParams(window.location.search);

    const query = makeQueryForParams(parts.length - 2, params, parentQuery);
    addGlobalParamsToQuery(getGlobalParams(), query);

    gotoUrl(makeUrl(parts, query));
}

export function getGlobalParams(url = window.location.href) {
    return getParamsWithSuffix(new URLSearchParams(new URL(url).search), '_g');
}

export function gotoInstance({structureKey, instanceKey, params={}, globalParams={}}) {
    const query = makeQueryForParams(0, params);
    addGlobalParamsToQuery(getGlobalParams(), query);
    addGlobalParamsToQuery(globalParams, query);
    gotoUrl(makeUrl([structureKey, instanceKey], query));
}

export function gotoInstanceScreen({structureKey, instanceKey, screenKey, params={}, globalParams={}}) {
    const parts = [structureKey, instanceKey, screenKey];
    const query = makeQueryForParams(1, params);
    addGlobalParamsToQuery(globalParams, query);
    addGlobalParamsToQuery(getGlobalParams(), query);
    gotoUrl(makeUrl(parts, query));
}

export function replaceInstance({structureKey, instanceKey}) {
    replaceUrl(makeUrl([structureKey, instanceKey]));
}

export function getParamsWithSuffix(urlParams, suffix) {
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

export function closeWindow() {
    console.log('closeWindow');
    window.close();
}

// TODO: Using a global variable is a hack.  We should use a context instead.
var global_url_watcher = null;

export function useLiveUrl() {
    const [url, setUrl] = useState(window.location.href);

    useEffect(() => {
        watchPopState(url => {
            setUrl(window.location.href);
        })
        global_url_watcher = url => {
            setUrl(url);
        }    
    }, []);

    return url;
}

export function gotoUrl(url) {
    if (window.location.pathname.includes('/teaser')) {
        window.parent.postMessage({type: 'psi-sidebar-gotoUrl', url}, '*');
        console.log('sent sidebar url', url);
    } else {
        historyPushState({state: {url}, url: url});
        if (global_url_watcher) {
            global_url_watcher(url);
        }
    }
}

export function replaceUrl(url) {
    console.log('replaceUrl', url);
    historyReplaceState({state: {url}, url: url});
    if (global_url_watcher) {
        global_url_watcher(url);
    }
}

