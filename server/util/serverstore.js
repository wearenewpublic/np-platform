const { firebaseReadAsync, firebaseWriteAsync, firebaseUpdateAsync, expandPath } = require("./firebaseutil");

// TODO: Batch writes and send them all to firebase together

class ServerStore {
    constructor({siloKey, structureKey, instanceKey, userId, userEmail, language}) {
        this.siloKey = siloKey;
        this.structureKey = structureKey;
        this.instanceKey = instanceKey;
        this.userId = userId;
        this.userEmail = userEmail;
        this.language = language;
    }

    getProps() {
        return {
            siloKey: this.siloKey, structureKey: this.structureKey, 
            instanceKey: this.instanceKey, userId: this.userId, 
            userEmail: this.userEmail, language: this.language
        };
    }


    getInstanceStore(structureKey, instanceKey) {
        return new ServerStore({
            siloKey: this.siloKey,
            structureKey,
            instanceKey,
            userId: this.userId,
            userEmail: this.userEmail
        });
    }

    getSiloKey() {return this.siloKey;}
    getStructureKey() {return this.structureKey;}
    getInstanceKey() {return this.instanceKey;}
    getUserId() {return this.userId;}
    getUserEmail() {return this.userEmail;}

    getInstancePrefix() {
        return ['silo', this.siloKey, 'structure', this.structureKey, 'instance', this.instanceKey];
    }

    async getGlobalPropertyAsync(key) {
        return await firebaseReadAsync([... this.getInstancePrefix(), 'global', key]);
    }

    async setGlobalPropertyAsync(key, value) {
        return await firebaseWriteAsync([... this.getInstancePrefix(), 'global', key], value);
    }

    async getObjectAsync(collection, key) {
        return await firebaseReadAsync([... this.getInstancePrefix(), 'collection', collection, key]);
    }

    async setObjectAsync(collection, key, value) {
        return await firebaseWriteAsync([... this.getInstancePrefix(), 'collection', collection, key], value);
    }

    async updateObjectAsync(collection, key, value) {
        return await firebaseUpdateAsync([... this.getInstancePrefix(), 'collection', collection, key], value);
    }

    async getCollectionAsync(collection) {
        return await firebaseReadAsync([... this.getInstancePrefix(), 'collection', collection]);
    }

    async getModulePublicAsync(module, path) {
        return await firebaseReadAsync(['silo', this.siloKey, 'module-public', module, expandPath(path)]);
    }

    async setModulePublicAsync(module, path, value) { 
        return await firebaseWriteAsync(['silo', this.siloKey, 'module-public', module, expandPath(path)], value);
    } 

    async getModulePrivateAsync(module, path) {
        return await firebaseReadAsync(['silo', this.siloKey, 'module-private', module, expandPath(path)]);
    }

    async setModulePrivateAsync(module, path, value) {
        return await firebaseWriteAsync(['silo', this.siloKey, 'module-private', module, expandPath(path)], value);
    }

    async setDerivedObjectAsync({structureKey, instanceKey, type, key, value}) {
        if (!type.startsWith('derived_')) {
            throw new Error('derived type ' + type + ' does not start with derived_');
        }
        return await firebaseWriteAsync(['silo', this.siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', type, key], value);
    }

    async modifyDerivedObjectAsync({structureKey, instanceKey, type, key, value}) {
        if (!type.startsWith('derived_')) {
            throw new Error('derived type ' + type + ' does not start with derived_');
        }
        return await firebaseUpdateAsync(['silo', this.siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', type, key], value);
    }

    async getRemoteObjectAsync({
            siloKey=this.siloKey, structureKey=this.structureKey, 
            instanceKey=this.instanceKey, type, key
        }) {
        return await firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', type, key]);
    }
}

exports.ServerStore = ServerStore;


function mockServerStore({
        siloKey='testSilo', structureKey='testStruct', 
        instanceKey='testInstance', userId='testuser', userEmail='admin@admin.org',
        language='English'
    } = {}) {
    return new ServerStore({siloKey, structureKey, instanceKey, userId, userEmail, language});
}
exports.mockServerStore = mockServerStore;
