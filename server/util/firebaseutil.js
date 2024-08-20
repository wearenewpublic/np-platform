
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
    const ref = admin.database().ref(expandPath(path));
    return await ref.set(data);
}

async function firebaseReadAsync(path) {
    const ref = admin.database().ref(expandPath(path));
    const snapshot = await ref.once('value');
    return snapshot.val();
}

async function firebaseReadWithFilterAsync(path, key, value) {
    const ref = admin.database().ref(expandPath(path));
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

async function readGlobalAsync({ siloKey, structureKey, instanceKey, key }) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key]);
}
async function writeGlobalAsync({ siloKey, structureKey, instanceKey, key, value }) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key], value);
}
async function writeCollectionAsync({ siloKey, structureKey, instanceKey, collection, items }) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection], items);
}
async function setObjectAsync({ siloKey, structureKey, instanceKey, collection, key, value }) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection, key], value);
}
async function readObjectAsync({ siloKey, structureKey, instanceKey, collection, key }) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', collection, key]);
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
        "'": '%q'
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

function keyToUrl(key) {
    return fbKeyToString(decodeURIComponent(key));
}

function urlToKey(url) {
    return encodeURIComponent(stringToFbKey(url));
}


function checkPathsNotOverlapping(pathList) {
    for (let i = 0; i < pathList.length; i++) {
        for (let j = i + 1; j < pathList.length; j++) {
            const path1 = pathList[i];
            const path2 = pathList[j];
            if (path1.startsWith(path2 + '/') || path2.startsWith(path1 + '/') || path1 == path2) {
                throw new Error('Written paths overlap: ' + path1 + ' and ' + path2);
            }
        }
    }
    return false;
}


module.exports = {
    firebaseWriteAsync, firebaseReadAsync, firebaseUpdateAsync, stringToFbKey, fbKeyToString,
    readGlobalAsync, writeGlobalAsync, writeCollectionAsync,
    setObjectAsync, readObjectAsync, firebaseReadWithFilterAsync,
    keyToUrl, urlToKey,

    verifyIdTokenAsync, createNewKey, firebaseGetUserAsync, expandPath, checkPathsNotOverlapping,

    setFirebaseAdmin, getFirebaseAdmin
};


