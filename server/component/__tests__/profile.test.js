const { mockServerStore } = require("../../util/serverstore");
const { logData, getTestData, clearTestData } = require("../../util/testutil");
const { updateProfileAsync, linkInstanceAsync } = require("../profile");

test('updateProfileAsync', async () => {
    const serverstore = mockServerStore({structureKey: 'profile', instanceKey: 'testuser', userId: 'testuser'});
    serverstore.setObject('backlink', '1', {structureKey: 'simplecomments', instanceKey: 'a'});
    serverstore.setObject('backlink', '2', {structureKey: 'question', instanceKey: 'b'});
    serverstore.setGlobalProperty('preview', {name: 'oldName', thingy: 'oldThingy'});
    serverstore.setGlobalProperty('fields', {name: 'oldName', foo: 'bar'});

    serverstore.setRemoteObject({structureKey: 'simplecomments', instanceKey: 'a', 
        type: 'persona', key: 'testuser', 
        value: {name: 'oldName', bla: 'blob'}});
    serverstore.setModulePublic('profile', ['pseudonym', 'oldName'], 'testuser');

    await serverstore.commitDataAsync();

    await updateProfileAsync({serverstore, 
        updates: {name: 'newName', wibble: 'wobble', nameMode: 'custom'}, 
        preview: {name: 'newName'}
    });
    await serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});

test('linkInstanceAsync', async () => {
    const serverstore = mockServerStore();
    serverstore.setObject('persona', 'testuser', {name: 'testuser', photoUrl: 'url'});
    await serverstore.commitDataAsync();
    
    await linkInstanceAsync({serverstore});
    await serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});