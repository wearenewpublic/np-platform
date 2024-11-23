const { mockServerStore } = require("../serverstore");
const { logData, getTestData } = require("../testutil");


test('updateModulePublic', async () => {
    const serverstore = mockServerStore();
    serverstore.setModulePublic('testModule', ['pathA', 'pathB'], {foo:'bar', animal: 'cat'});
    await serverstore.commitDataAsync();

    serverstore.updateModulePublic('testModule', ['pathA', 'pathB'], {animal: 'dog', color: 'brown'});
    await serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});

test('modulePrivate', async () => {
    const serverstore = mockServerStore();
    serverstore.setModulePrivate('testModule', ['pathA', 'pathB'], {foo:'bar', animal: 'cat'});
    await serverstore.commitDataAsync();

    const result = await serverstore.getModulePrivateAsync('testModule', ['pathA', 'pathB']);
    expect(result).toEqual({foo:'bar', animal: 'cat'});
})

test('derived object', async () => {
    const serverstore = mockServerStore();
    serverstore.setDerivedObject({
        structureKey: 'otherStruct', instanceKey: 'otherInstance', 
        type: 'derived_type', key: '1', value: {a: 1, b: 3}});
    await serverstore.commitDataAsync();
    
    serverstore.updateDerivedObjectAsync({
        structureKey: 'otherStruct', instanceKey: 'otherInstance', 
        type: 'derived_type', key: '1', updateMap: {a: 2}});
    await serverstore.commitDataAsync();

    const result = await serverstore.getRemoteObjectAsync({
        structureKey: 'otherStruct', instanceKey: 'otherInstance', 
        type: 'derived_type', key: '1'});
    expect(result).toEqual({a: 2, b: 3});
});

test('remote global', async () => {
    const serverstore = mockServerStore();
    serverstore.setRemoteGlobal({
        structureKey: 'otherStruct', instanceKey: 'otherInstance',
        key: 'testKey', value: {foo: 'bar', animal: 'cat'}
    });
    await serverstore.commitDataAsync();

    const result = await serverstore.getRemoteGlobalAsync({
        structureKey: 'otherStruct', instanceKey: 'otherInstance',
        type: 'global', key: 'testKey'
    });
    expect(result).toEqual({foo: 'bar', animal: 'cat'});
});

test('getPersonaAsync', async () => {
    const serverstore = mockServerStore();
    const result = await serverstore.getPersonaAsync('testuser');
    expect(result).toEqual({
        key: 'testuser', name: 'Test User', photoUrl: 'photo-url'
    });

    serverstore.setRemoteGlobal({
        structureKey: 'profile', instanceKey: 'testuser',
        key: 'preview', value: {name: 'newname', hue: 25}
    })
    await serverstore.commitDataAsync();

    const result2 = await serverstore.getPersonaAsync('testuser');
    expect(result2).toEqual({key: 'testuser', name: 'newname', hue: 25});
})

test('setBacklink', async () => {
    const serverstore = mockServerStore();
    serverstore.setBacklink('topic', 'cats', {preview: 'hello'});
    await serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});

test('removeBacklink', async () => {
    const serverstore = mockServerStore();
    serverstore.setBacklink('topic', 'cats', {preview: 'hello'});
    await serverstore.commitDataAsync();

    serverstore.removeBacklink('topic', 'cats');
    await serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});
