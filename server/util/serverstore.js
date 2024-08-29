const { firebaseReadAsync, firebaseWriteAsync, firebaseUpdateAsync, expandPath, checkPathsNotOverlapping, firebaseGetUserAsync, checkNoUndefinedKeysOrValues, firebaseReadShallowKeys } = require("./firebaseutil");

// TODO: Batch writes and send them all to firebase together

class ServerStore {
    constructor({siloKey, structureKey, instanceKey, userId, userEmail, language}) {
        this.siloKey = siloKey;
        this.structureKey = structureKey;
        this.instanceKey = instanceKey;
        this.userId = userId;
        this.userEmail = userEmail;
        this.language = language;
        this.delayedWrites = {};
        this.parent = null;
    }

    getProps() {
        return {
            siloKey: this.siloKey, structureKey: this.structureKey, 
            instanceKey: this.instanceKey, userId: this.userId, 
            userEmail: this.userEmail, language: this.language
        };
    }

    getSiloKey() {return this.siloKey;}
    getStructureKey() {return this.structureKey;}
    getInstanceKey() {return this.instanceKey;}
    getUserId() {return this.userId;}
    getUserEmail() {return this.userEmail;}

    getInstancePrefix() {
        return ['silo', this.siloKey, 'structure', this.structureKey, 'instance', this.instanceKey];
    }

    doDelayedWrite(path, value) {
        if (this.parent) {
            this.parent.doDelayedWrite(path, value);
        } else {
            checkNoUndefinedKeysOrValues(value);
            this.delayedWrites[expandPath(path)] = value;
        }
    }

    doDelayedUpdate(path, updateMap) {
        const updateKeys = Object.keys(updateMap ?? {});
        updateKeys.forEach(k => {
            this.doDelayedWrite([...path, k], updateMap[k]); 
        });
    }

    getDelayedWrites() {
        return this.delayedWrites;
    }

    // TODO: Maybe allow overlapping paths provided the data written is the same
    async commitDataAsync() {
        checkPathsNotOverlapping(Object.keys(this.delayedWrites));
        await firebaseUpdateAsync('/', this.delayedWrites);
        this.delayedWrites = {};
    }

    async getGlobalPropertyAsync(key) {
        return await firebaseReadAsync([... this.getInstancePrefix(), 'global', key]);
    }

    async setGlobalProperty(key, value) {
        this.doDelayedWrite([... this.getInstancePrefix(), 'global', key], value);
    }

    async getObjectAsync(collection, key) {
        return await firebaseReadAsync([... this.getInstancePrefix(), 'collection', collection, key]);
    }

    setObject(collection, key, value) {
        this.doDelayedWrite([... this.getInstancePrefix(), 'collection', collection, key], 
            {...value, key});
    }

    updateObject(collection, key, updateMap) {
        this.doDelayedUpdate([
            ... this.getInstancePrefix(), 'collection', collection, key
            ], updateMap
        );
    }

    async getCollectionAsync(collection) {
        const itemMap = await firebaseReadAsync([... this.getInstancePrefix(), 'collection', collection]);
        var itemList = [];
        const keys = Object.keys(itemMap ?? {});
        keys.forEach(key => {
            itemList.push({...itemMap[key], key});
        });
        return itemList;
    }

    async getModulePublicAsync(module, path) {
        return await firebaseReadAsync(['silo', this.siloKey, 'module-public', module, expandPath(path)]);
    }

    async updateModulePublic(module, path, updateMap) {
        this.doDelayedUpdate(['silo', this.siloKey, 'module-public', module, expandPath(path)], updateMap);
    }

    async setModulePublic(module, path, value) { 
        this.doDelayedWrite(['silo', this.siloKey, 'module-public', module, expandPath(path)], value);
    } 

    async getModulePrivateAsync(module, path) {
        return await firebaseReadAsync(['silo', this.siloKey, 'module', module, expandPath(path)]);
    }

    async setModulePrivate(module, path, value) {
        this.doDelayedWrite(['silo', this.siloKey, 'module', module, expandPath(path)], value);
    }

    async setDerivedObject({structureKey, instanceKey, type, key, value}) {
        if (!type.startsWith('derived_')) {
            throw new Error('derived type ' + type + ' does not start with derived_');
        }
        return await firebaseWriteAsync(['silo', this.siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', type, key], value);
    }

    async setBacklink(structureKey, instanceKey, value={}) {
        this.doDelayedWrite([
            'silo', this.siloKey, 'structure', structureKey, 
            'instance', instanceKey, 'collection',
            'backlink_' + this.structureKey, this.instanceKey
        ], {...value, key: this.instanceKey});
    }

    async setGenericBacklink(structureKey, instanceKey, value={}) {
        const key = this.structureKey + '_' + this.instanceKey;
        this.doDelayedWrite([
            'silo', this.siloKey, 'structure', structureKey, 
            'instance', instanceKey, 'collection',
            'backlink', key
        ], {...value, key, structureKey: this.structureKey, instanceKey: this.instanceKey});
    }


    async updateDerivedObjectAsync({structureKey, instanceKey, type, key, updateMap}) {
        if (!type.startsWith('derived_')) {
            throw new Error('derived type ' + type + ' does not start with derived_');
        }
        this.doDelayedUpdate([
            'silo', this.siloKey, 'structure', structureKey, 'instance', 
            instanceKey, 'collection', type, key
        ], updateMap);
    }

    async getRemoteObjectAsync({
        siloKey=this.siloKey, structureKey=this.structureKey, 
        instanceKey=this.instanceKey, type, key
    }) {
        return await firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', type, key]);
    }

    async getRemoteGlobalAsync({
        siloKey=this.siloKey, structureKey=this.structureKey, instanceKey=this.instanceKey, key
    }) {
        return await firebaseReadAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key]);
    }

    async getStructureInstanceKeysAsync(structureKey) {
        return await firebaseReadShallowKeys([
            'silo', this.siloKey, 'structure', structureKey, 'instance'
        ]);
    }

    async getAllSiloKeysAsync() {
        return await firebaseReadShallowKeys(['silo']);
    }

    setRemoteGlobal({
        siloKey=this.siloKey, structureKey=this.structureKey, 
        instanceKey=this.instanceKey, key, value
    }) {
        this.doDelayedWrite([
            'silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', key
        ], value);
    }

    setRemoteObject({
        siloKey=this.siloKey, structureKey=this.structureKey, 
        instanceKey=this.instanceKey, type, key, value
    }) {
        return this.doDelayedWrite([
            'silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 
            'collection', type, key
        ], value);
    }

    updateRemoteObject({
        siloKey=this.siloKey, structureKey=this.structureKey, 
        instanceKey=this.instanceKey, type, key, updateMap
    }) {
        return this.doDelayedUpdate([
            'silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 
            'collection', type, key
        ], updateMap);
    }

    async getPersonaAsync(userId) {
        const personaPreview = await this.getRemoteGlobalAsync({
            structureKey: 'profile', instanceKey: userId, key: 'preview'
        });
        if (personaPreview) {
            return {key: userId, ...personaPreview};
        } else {
            const userInfo = await firebaseGetUserAsync(userId);
            return {key: userId, name: userInfo.displayName, photoUrl: userInfo.photoURL ?? null};
        }
    }

    async getMyPersonaAsync() {
        return await this.getPersonaAsync(this.userId);
    }

    createInstance({structureKey, instanceKey, globals, persona}) {
        const collection = {
            persona: {[persona.key]: persona}
        }
        this.doDelayedWrite([
            'silo', this.siloKey, 'structure', structureKey, 'instance', instanceKey
        ], {global: globals, collection});
    }
    
    addPersonaToInstance({structureKey=this.structureKey, instanceKey=this.instanceKey, personaKey, persona}) {
        this.setRemoteObject({
            structureKey, instanceKey, type: 'persona', key: personaKey, 
            value: {...persona, linked: true}
        });
        const backlinkKey = structureKey + '_' + instanceKey;
        this.setRemoteObject({
            structureKey: 'profile', instanceKey: personaKey, type: 'backlink', key: backlinkKey,
            value: {key: backlinkKey, structureKey, instanceKey}
        });
    }

    getRemoteStore({
        siloKey=this.siloKey, structureKey=this.structureKey, instanceKey=this.instancekey, 
        userId=this.userId, userEmail=this.userEmail, language=this.language
    }) {
        const remoteStore = new ServerStore({
            siloKey, structureKey, instanceKey, userId, userEmail, language
        });
        remoteStore.parent = this;
        return remoteStore;
    }

    getDetachedServerStore() {
        return new ServerStore({
            siloKey: this.siloKey, structureKey: this.structureKey, 
            instanceKey: this.instanceKey, userId: this.userId, 
            userEmail: this.userEmail, language: this.language
        });
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
