
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

async function getOrCreateUserAsync({email, name, photoUrl}) {
    try {
        return await admin.auth().getUserByEmail(email);
    } catch (e) {
        try {
            return await admin.auth().createUser({
                email: email,
                displayName: name,
                photoURL: photoUrl
            });
        } catch (e) {
            console.error('Error creating user: ' + JSON.stringify({email, name, photoUrl}), e);
            throw e;
        } 
    }
}

async function createLoginToken(uid) {
    return admin.auth().createCustomToken(uid);
}

function expandPath(path) {
    if (typeof path == 'string') {
        return path;
    } else {
        if (path.some(p => !p)) {
            throw new Error('Firebase path cannot contain null or undefined elements: ' + JSON.stringify(path));
        }
        return path.join('/');
    }
}

function checkNoUndefinedKeysOrValues(obj) {
    if (typeof obj !== 'object') {
        return;
    }
    for (let key in obj) {
        if (obj[key] === undefined) {
            throw new Error('Undefined value for key "' + key + '" in object: ' + JSON.stringify(obj));
        } else {
            checkNoUndefinedKeysOrValues(obj[key]);
        }
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

async function firebaseGetUserListAsync() {
    var nextPageToken = null;
    var users = [];
    const result = await admin.auth().listUsers(1000);
    users = users.concat(result.users);
    nextPageToken = result.pageToken;
    while (nextPageToken) {
        const result = await admin.auth().listUsers(1000, nextPageToken);
        users = users.concat(result.users);
        nextPageToken = result.pageToken;
    };
    return users;
}

async function firebaseReadShallowKeys(path) {
    const ref = admin.database().ref(expandPath(path));
    var topLevelKeys = [];
    const snapshot = await ref.orderByKey().once('value');
    snapshot.forEach(childSnapshot => {
        topLevelKeys.push(childSnapshot.key);
    });
    return topLevelKeys;
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


export {
    firebaseWriteAsync, firebaseReadAsync, firebaseUpdateAsync, stringToFbKey, fbKeyToString,
    firebaseReadShallowKeys, firebaseGetUserListAsync,
    readGlobalAsync, writeGlobalAsync, writeCollectionAsync,
    setObjectAsync, readObjectAsync, firebaseReadWithFilterAsync,
    keyToUrl, urlToKey,

    getOrCreateUserAsync, createLoginToken,

    verifyIdTokenAsync, createNewKey, firebaseGetUserAsync, expandPath, 
    checkPathsNotOverlapping, checkNoUndefinedKeysOrValues,

    setFirebaseAdmin, getFirebaseAdmin
};
