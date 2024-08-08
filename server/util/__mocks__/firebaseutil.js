
var global_data = {};

async function clearMockFirebaseAsync() {
    global_data = {};
}
exports.clearMockFirebaseAsync = clearMockFirebaseAsync

async function firebaseWriteAsync(path, value) {
    var result = global_data;
    const prefix = path.slice(0, -1);
    const lastField = path[path.length - 1];
    prefix.forEach(part => {
        if (result[part] == undefined) {
            result[part] = {};
        }
        result = result[part];
    });
    result[lastField] = value;
}
exports.firebaseWriteAsync = firebaseWriteAsync;

async function firebaseReadAsync(path) {
    var result = global_data;
    path.forEach(part => {
        result = result?.[part];
    });
    return result;
}
exports.firebaseReadAsync = firebaseReadAsync;

async function firebaseUpdateAsync(path, value) {
    const old = await firebaseReadAsync(path);
    const updated = {...old, ...value};
    await firebaseWriteAsync(path, updated);
}
exports.firebaseUpdateAsync = firebaseUpdateAsync;

async function readGlobalAsync({siloKey, structureKey, instanceKey, key}) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key]);
}
async function writeGlobalAsync({siloKey, structureKey, instanceKey, key, value}) {
    return firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key], value);
}
async function readCollectionAsync({siloKey, structureKey, instanceKey, type}) {
    return firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', type]);
}
exports.readCollectionAsync = readCollectionAsync;
exports.writeGlobalAsync = writeGlobalAsync;
exports.readGlobalAsync = readGlobalAsync;

exports.firebaseGetUserAsync = jest.fn();

exports.setFirebaseAdmin = jest.fn();
exports.verifyIdTokenAsync = jest.fn();
