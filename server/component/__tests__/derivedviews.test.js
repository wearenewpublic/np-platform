const { setObjectAsync, readObjectAsync } = require("../../util/firebaseutil");
const { getTestData } = require("../../util/testutil");
const { TriggerDatastore, runTriggersApi } = require("../derivedviews");

describe('TriggerDatastore', () => {
    const cats = {1: {name: 'mog'}};
    test('getCollection', () => {
        const datastore = new TriggerDatastore('silo', {cats});
        const result = datastore.getCollection('cats');
        expect(result).toEqual([{name: 'mog'}]);
    });
    test('getObject', () => {
        const datastore = new TriggerDatastore('silo', {cats});
        const result = datastore.getObject('cats', 1);
        expect(result).toEqual({name: 'mog'});
    });  
    test('getGlobal', () => {
        const datastore = new TriggerDatastore('silo', {}, {name: 'mog'});
        const result = datastore.getGlobal('name');
        expect(result).toEqual('mog');
    });
})


test('runTriggersApi', async () => {
    await setObjectAsync({siloKey: 'cbc', structureKey: 'simplecomments', instanceKey: 'demo', 
        collection: 'comment', key: '1', value: {text: 'Hello', from: 'testuser', key: 1}});

    await runTriggersApi({siloKey: 'cbc', structureKey: 'simplecomments', 
        instanceKey: 'demo', type: 'comment', key: '1'});

    const linkedComment = await readObjectAsync({siloKey: 'cbc', structureKey: 'profile',
        instanceKey: 'testuser', collection: 'derived_comment', key: '1'
    });
    expect(linkedComment.text).toBe('Hello');
});

