const { getMigrationList } = require("../migrations");
const { checkIsGlobalAdmin } = require("../util/admin");
const { firebaseReadAsync, createNewKey, firebaseWriteAsync, firebaseUpdateAsync } = require("../util/firebaseutil");

async function getMigrationPreviewsAsync({serverstore}) {
    checkIsGlobalAdmin(serverstore);
    const migrationList = getMigrationList();
    const migrationPreviews = migrationList.map(migration => {
        return {
            key: migration.key,
            name: migration.name,
            description: migration.description,
        }
    });
    return migrationPreviews;
}

async function getSingleMigrationAsync({serverstore, migrationKey}) {
    checkIsGlobalAdmin(serverstore);
    const migrationList = getMigrationList();
    const migration = migrationList.find(migration => migration.key === migrationKey);
    if (!migration) throw new Error('Migration not found: ' + migrationKey);
    return {key: migration.key, name: migration.name, description: migration.description};
}

async function getPastMigrationExecutionsAsync({serverstore, migrationKey}) {
    checkIsGlobalAdmin(serverstore);
    const migrationInstances = await firebaseReadAsync(['migrations', migrationKey]);
    return migrationInstances;
}

async function runMigrationAsync({serverstore, migrationKey, preview=true}) {
    checkIsGlobalAdmin(serverstore);
    const migrationList = getMigrationList();
    const migration = migrationList.find(migration => migration.key === migrationKey);
    const detachedServerStore = serverstore.getDetachedServerStore();
    await migration.runner({serverstore: detachedServerStore});
    const delayedWrites = detachedServerStore.getDelayedWrites();
    const {undoWrites, prunedWrites} = await getUndoLog({delayedWrites});

    if (!preview) {
        const migrationExecutionKey = createNewKey();
        await firebaseWriteAsync(['migrations', migrationKey, migrationExecutionKey], {
            time: Date.now(),
            undoWrites: JSON.stringify(undoWrites),
            prunedWrites: JSON.stringify(prunedWrites),
        });
        await detachedServerStore.commitDataAsync();
    }

    return {forwardWrites:prunedWrites, undoWrites};
}

async function rollBackMigrationAsync({serverstore, migrationKey, executionKey}) {
    checkIsGlobalAdmin(serverstore);
    const execution = await firebaseReadAsync(['migrations', migrationKey, executionKey]);
    console.log('execution', migrationKey, executionKey, execution);
    const undoWrites = JSON.parse(execution.undoWrites);
    await firebaseUpdateAsync('/', undoWrites);
    await firebaseUpdateAsync(['migrations', migrationKey, executionKey], {rolledBack: true});
}

async function getUndoLog({delayedWrites}) {
    const prunedWrites = {...delayedWrites}
    const oldData = await firebaseReadAsync(['silo']);
    var undoWrites = {};
    const writeKeys = Object.keys(delayedWrites);
    writeKeys.forEach(writeKey => {
        prevValue = readPathFromObject(writeKey, {silo: oldData});
        if (shallowEqual(prevValue, prunedWrites[writeKey])) {
            delete prunedWrites[writeKey];
        } else {
            undoWrites[writeKey] = prevValue;
        }
    })
    return {undoWrites, prunedWrites};
}

function readPathFromObject(path, object) {
    const parts = path.split('/').filter(x => x);
    var current = object;
    parts.forEach(part => {
        current = current?.[part];
    });
    return current ?? null;
}

function shallowEqual(obj1, obj2) {
    // Check if both are objects and are not null
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      return false;
    }
  
    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    // Check if they have the same number of keys
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    // Check if values for each key are the same
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  
    return true;
}

exports.adminFunctions = {
    getMigrationPreviews: getMigrationPreviewsAsync,
    getSingleMigration: getSingleMigrationAsync,
    getPastExecutions: getPastMigrationExecutionsAsync,
    runMigration: runMigrationAsync, 
    rollBackMigration: rollBackMigrationAsync,
}

