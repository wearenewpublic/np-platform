import { fileHostDomain } from "./config";
import { ensureNextLocalKeyGreater, newLocalKey } from "./datastore";

export function expandDataList(list) {
    const date = new Date();
    date.setHours(date.getHours() - 1);

    var collection = {};

    list.forEach(item => {
        date.setMinutes(date.getMinutes() + 1);

        const key = item.key || newLocalKey();
        // ensureNextKeyGreater(key);
        ensureNextLocalKeyGreater(key);
        collection[key] = {
            ...item,
            key,
            time: date.getTime()
        };
    });

    return collection;
}


export function removeKey(collection, key) {
    const newCollection = {...collection};
    delete newCollection[key];
    return newCollection;
}

export function addKey(collection, key, value=true) {
    return {...collection, [key]: value};
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
    return template.replace(/{([^}]+)}/g, (match, key) => {
      return values.hasOwnProperty(key) ? values[key] : match;
    });
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

  export function getPath(object, path) {
    const parts = path.split('.');
    var result = object;
    parts.forEach(part => {
        result = result?.[part];
    });
    return result;
  }

  export function setPath(object, path, value) {
    const parts = path.split('.');
    const newObject = deepClone(object);
    var subpart = newObject;
    parts.forEach((part, index) => {
      if (index == parts.length - 1) {
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


export function expandUrl({url, type}) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    } else {
        return fileHostDomain + '/' + type + '/' + url;
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
