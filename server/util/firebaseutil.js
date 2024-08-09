
var admin = null;

function setFirebaseAdmin(newAdmin) {
    admin = newAdmin;
}

function getFirebaseAdmin() {
    return admin;
}

function verifyIdTokenAsync(token) {
    return admin.auth().verifyIdToken(token);
}

function expandPath(path) {
    if (typeof path == 'string') {
        return path;
    } else {
        if (path.some(p => !p)) {
            console.error('Bad firebase path', path);
            throw new Error('Firebase path cannot contain null or undefined elements: ' + JSON.stringify(path));
        }  
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

async function firebaseReadWithFilterAsync(path, key, value) {
    const ref  = admin.database().ref(expandPath(path));
    const snapshot = await ref.orderByChild(key).equalTo(value).once('value');
    return snapshot.val();
}

async function firebaseUpdateAsync(path, data) {
    const ref = admin.database().ref(expandPath(path));
    return await ref.update(data);
}

async function firebaseGetUserAsync(userId) {
    return await admin.auth().getUser(userId);
}

function createNewKey() {
    return admin.database().ref().push().key;
}

async function readGlobalAsync({siloKey, structureKey, instanceKey, key}) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key]);
}
async function writeGlobalAsync({siloKey, structureKey, instanceKey, key, value}) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key], value);
}
async function readCollectionAsync({siloKey, structureKey, instanceKey, type}) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', type]);
}
async function readMultipleCollectionsAsync({siloKey, structureKey, instanceKey, types}) {
    const dataArray = await Promise.all(types.map(type => readCollectionAsync({siloKey, structureKey, instanceKey, type})));
    var resultMap = {};
    types.forEach((typeName, i) => resultMap[typeName] = dataArray[i]);
    return resultMap;
}
async function readModulePublicAsync({siloKey, moduleKey, key}) {
    return firebaseReadAsync(['silo', siloKey, 'module-public', moduleKey, key]);
}
async function writeModulePublicAsync({siloKey, moduleKey, key, value}) {
    return firebaseWriteAsync(['silo', siloKey, 'module-public', moduleKey, key], value);
}


async function readAllGlobalsAsync({siloKey, structureKey, instanceKey}) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global']);
}

async function writeCollectionAsync({siloKey, structureKey, instanceKey, collection, items}) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection], items);
}
async function updateCollectionAsync({siloKey, structureKey, instanceKey, collection, updates}) {
    return firebaseUpdateAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection], updates);
}
async function setObjectAsync({siloKey, structureKey, instanceKey, collection, key, value}) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection, key], value);
}
async function updateObjectAsync({siloKey, structureKey, instanceKey, collection, key, value}) {
    return firebaseUpdateAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection, key], value);
}
async function readObjectAsync({siloKey, structureKey, instanceKey, collection, key}) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection, key]);
}
async function createInstanceAsync({siloKey, structureKey, instanceKey, collection=null, global=null}) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey], {collection, global});
}
async function readInstanceAsync({siloKey, structureKey, instanceKey}) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey]);
}

function stringToFbKey(input) {
    const mapping = {
      '.': '%d',
      '#': '%h',
      '$': '%s',
      '/': '%f',
      '[': '%l',
      ']': '%r',
      '%': '%%',
      "'" : '%q'
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
        '%%': '%',
        '%q': "'"
    };

    return input.replace(/%d|%h|%s|%f|%l|%r|%%/g, match => reverseMapping[match]);
}



module.exports = {firebaseWriteAsync, firebaseReadAsync, firebaseUpdateAsync, stringToFbKey, fbKeyToString, 
    readGlobalAsync, writeGlobalAsync, readCollectionAsync, createInstanceAsync, writeCollectionAsync,
    readInstanceAsync, setObjectAsync, readMultipleCollectionsAsync, updateCollectionAsync,
    readObjectAsync, readAllGlobalsAsync, updateObjectAsync, firebaseReadWithFilterAsync,
    readModulePublicAsync, writeModulePublicAsync,

    verifyIdTokenAsync, createNewKey, firebaseGetUserAsync,

    setFirebaseAdmin, getFirebaseAdmin
};


  