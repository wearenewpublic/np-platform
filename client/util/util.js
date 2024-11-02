import { getIsLocalhost } from "../platform-specific/url";
import { fileHostDomain, localHostApiDomain } from "./config";


export function removeKey(collection, key) {
    const newCollection = { ...collection };
    delete newCollection[key];
    return newCollection;
}

export function addKey(collection, key, value = true) {
    return { ...collection, [key]: value };
}

export function isNonEmpty(collection) {
    return Object.keys(collection || {}).length > 0;
}

export function removeNullProperties(obj) {
    const clone = { ...obj };
    for (const key in clone) {
        if (!clone[key]) {
            delete clone[key]; // Remove key-value pair if the value is null
        }
    }
    return clone;
}

export function stripSuffix(str, suffix) {
    if (str.endsWith(suffix)) {
        return str.substring(0, str.length - suffix.length);
    } else {
        return str;
    }
}

export async function forEachAsync(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function formatString(template, values) {
    return template.replace(/{([^}]+)}/g, (match, key) => values[key] ?? '');
}

export function generateRandomKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = randomArray[i] % characters.length;
        result += characters.charAt(randomIndex);
    }

    return result;
}


export function boolToString(bool) {
    return bool ? 'true' : 'false';
}

export function stringToBool(string) {
    return string == 'true';
}

export function boolToInt(bool) {
    return bool ? 1 : 0;
}

export function getObjectPropertyPath(object, path) {
    var result = object;
    path.forEach(part => {
        result = result?.[part];
    });
    return result;
}

export function setObjectPropertyPath(object, path, value) {
    const newObject = deepClone(object);
    var subpart = newObject;
    path.forEach((part, index) => {
        if (index == path.length - 1) {
            subpart[part] = value;
        } else {
            if (subpart[part] == undefined) {
                subpart[part] = {};
            }
            subpart = subpart[part];
        }
    });
    return newObject;
}


export function makeAssetUrl(urlSuffix) {
    if (urlSuffix.startsWith('http://') || urlSuffix.startsWith('https://')) {
        return urlSuffix;
    } else if (getIsLocalhost()) {
        return localHostApiDomain + '/' + urlSuffix;
    } else {
        return fileHostDomain + '/' + urlSuffix;
    }
}

export function mapKeys(object, callback) {
    let previousKey = null;
    return Object.keys(object || {}).map(key => {
        const result = callback(key, object[key], previousKey);
        previousKey = key;
        return result;
    });
}

export function getFirstName(name) {
    return (name || '').trim().split(' ')[0];
}

export function textToPathPath(text) {
    return encodeURIComponent(text.replace(/ /g, '-'));
}

export function pathPartToText(text) {
    return decodeURIComponent(text).replace(/-/g, ' ');
}

export function questionToPathPart(question) {
    return textToPathPath(question.replace(/\?/g, ''));
}

export function pathPartToQuestion(text) {
    return pathPartToText(text) + '?';
}

export async function pauseAsync(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function requireParams(funcname, params) {
    const paramKeys = Object.keys(params);
    paramKeys.forEach(key => {
        if (!params[key]) {
            throw new Error(`Missing parameter ${key} in ${funcname}`);
        }
    })
}

export function removeUndefinedFields(obj) {
    const clone = { ...obj };
    for (const key in clone) {
        if (clone[key] === undefined) {
            delete clone[key];
        }
    }
    return clone;
}

export function toBool(arg) {
    if (arg) {
        return true;
    } else {
        return false;
    }
}

export function sortBy(array, field) {
    return [...array].sort((a, b) => {
        const fieldA = a[field];
        const fieldB = b[field];

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            return fieldA.localeCompare(fieldB); // String comparison
        } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
            return fieldA - fieldB; // Numeric comparison
        } else {
            return 0; // Fallback for other types or when fields are undefined
        }
    });
}

export function keysToTrueMap(keys) {
    const map = {};
    keys.forEach(key => {
        map[key] = true;
    });
    return map;
}

export function assembleUrl(baseUrl, queryParams) {
    const url = new URL(baseUrl);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
    return url.toString();
}

export function makeRandomNonce() {
    if (process.env.NODE_ENV === 'test') {
        return 'testnonce';
    } else {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

export async function sleepMillisAsync(time=1000) {
    await new Promise(resolve => setTimeout(resolve, time));
}
