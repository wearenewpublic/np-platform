
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

async function firebaseGetUserAsync(userId) {
    console.log('getUserAsync2', userId, admin, admin?.auth());
    return await admin.auth().getUser(userId);
}

function createNewKey() {
    return admin.database().ref().push().key;
}

async function readGlobalAsync({structure, instance, key}) {
    return firebaseReadAsync(['structure', structure, 'instance', instance, 'global', key]);
}
async function writeGlobalAsync({structure, instance, key, value}) {
    return firebaseWriteAsync(['structure', structure, 'instance', instance, 'global', key], value);
}
async function readCollectionAsync({structure, instance, type}) {
    return firebaseReadAsync(['structure', structure, 'instance', instance, 'collection', type]);
}
async function readMultipleCollectionsAsync({structure, instance, types}) {
    const dataArray = await Promise.all(types.map(type => readCollectionAsync({structure, instance, type:type})));
    var resultMap = {};
    types.forEach((typeName, i) => resultMap[typeName] = dataArray[i]);
    return resultMap;
}
async function writeCollectionAsync({structure, instance, collection, items}) {
    return firebaseWriteAsync(['structure', structure, 'instance', instance, 'collection', collection], items);
}
async function updateCollectionAsync({structure, instance, collection, updates}) {
    return firebaseUpdateAsync(['structure', structure, 'instance', instance, 'collection', collection], updates);
}
async function setObjectAsync({structure, instance, collection, key, value}) {
    return firebaseWriteAsync(['structure', structure, 'instance', instance, 'collection', collection, key], value);
}
async function readObjectAsync({structure, instance, collection, key}) {
    return firebaseReadAsync(['structure', structure, 'instance', instance, 'collection', collection, key]);
}
async function createInstanceAsync({structure, instance, collection=null, global=null}) {
    return firebaseWriteAsync(['structure', structure, 'instance', instance], {collection, global});
}
async function readInstanceAsync({structure, instance}) {
    return firebaseReadAsync(['structure', structure, 'instance', instance]);
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
    readObjectAsync,

    verifyIdTokenAsync, createNewKey, firebaseGetUserAsync,

    setFirebaseAdmin, getFirebaseAdmin
};


  