
const admin = require('firebase-admin');

function expandPath(path) {
    if (typeof path == 'string') {
        return path;
    } else {
        return path.join('/');
    }
} 


async function firebaseWriteAsync(path, data) {
    const ref  = admin.database().ref(expandPath(path));
    return await ref.set(data);
}

async function firebaseReadAsync(path) {
    const ref  = admin.database().ref(expandPath(path));
    const snapshot = await ref.once('value');
    return snapshot.val();
}

async function firebaseUpdateAsync(path, data) {
    const ref = admin.database().ref(expandPath(path));
    return await ref.update(data);
}

async function readGlobalAsync({prototype, instance, key}) {
    return firebaseReadAsync(['prototype', prototype, 'instance', instance, 'global', key]);
}
async function writeGlobalAsync({prototype, instance, key, value}) {
    return firebaseWriteAsync(['prototype', prototype, 'instance', instance, 'global', key], value);
}
async function readCollectionAsync({prototype, instance, type}) {
    return firebaseReadAsync(['prototype', prototype, 'instance', instance, 'collection', type]);
}
async function readMultipleCollectionsAsync({prototype, instance, types}) {
    const dataArray = await Promise.all(types.map(type => readCollectionAsync({prototype, instance, type:type})));
    var resultMap = {};
    types.forEach((typeName, i) => resultMap[typeName] = dataArray[i]);
    return resultMap;
}
async function writeCollectionAsync({prototype, instance, collection, items}) {
    return firebaseWriteAsync(['prototype', prototype, 'instance', instance, 'collection', collection], items);
}
async function updateCollectionAsync({prototype, instance, collection, updates}) {
    return firebaseUpdateAsync(['prototype', prototype, 'instance', instance, 'collection', collection], updates);
}
async function setObjectAsync({prototype, instance, collection, key, value}) {
    return firebaseWriteAsync(['prototype', prototype, 'instance', instance, 'collection', collection, key], value);
}
async function readObjectAsync({prototype, instance, collection, key}) {
    return firebaseReadAsync(['prototype', prototype, 'instance', instance, 'collection', collection, key]);
}
async function createInstanceAsync({prototype, instance, collection, global}) {
    return firebaseWriteAsync(['prototype', prototype, 'instance', instance], {collection, global});
}
async function readInstanceAsync({prototype, instance}) {
    return firebaseReadAsync(['prototype', prototype, 'instance', instance]);
}

function stringToFbKey(input) {
    const mapping = {
      '.': '%d',
      '#': '%h',
      '$': '%s',
      '/': '%f',
      '[': '%l',
      ']': '%r',
      '%': '%%'
    };
  
    return input.replace(/[.$#/[\]%]/g, match => mapping[match]);
  }
  
function fbKeyToString(input) {
    const reverseMapping = {
        '%d': '.',
        '%h': '#',
        '%s': '$',
        '%f': '/',
        '%l': '[',
        '%r': ']',
        '%%': '%'
    };

    return input.replace(/%d|%h|%s|%f|%l|%r|%%/g, match => reverseMapping[match]);
}



module.exports = {firebaseWriteAsync, firebaseReadAsync, firebaseUpdateAsync, stringToFbKey, fbKeyToString, 
    readGlobalAsync, writeGlobalAsync, readCollectionAsync, createInstanceAsync, writeCollectionAsync,
    readInstanceAsync, setObjectAsync, readMultipleCollectionsAsync, updateCollectionAsync,
    readObjectAsync
};


  