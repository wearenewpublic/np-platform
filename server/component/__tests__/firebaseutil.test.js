const { read } = require("fs");
const { setFirebaseAdmin, firebaseWriteAsync, firebaseReadAsync, firebaseReadWithFilterAsync, firebaseUpdateAsync, firebaseGetUserAsync, createNewKey, writeGlobalAsync, readGlobalAsync, stringToFbKey, fbKeyToString } = require("../../util/firebaseutil");
const { fakeFirebaseAdmin, clearTestData } = require("../../util/testutil");


test('firebaseWriteAsync', async () => {
    await firebaseWriteAsync(['silo', 'cbc', 'module-public', 'admin', 'adminEmails'], 'test');
    const result = await firebaseReadAsync(['silo', 'cbc', 'module-public', 'admin', 'adminEmails']);
    expect(result).toBe('test');
});

test('firebaseReadWithFilterAsync', async () => {
    await firebaseWriteAsync(['foo', 'bar', 1], {animal:'cat', name:'fluffy'});
    await firebaseWriteAsync(['foo', 'bar', 2], {animal:'cat', name:'whiskers'});
    await firebaseWriteAsync(['foo', 'bar', 3], {animal:'dog', name:'rover'});
    await firebaseWriteAsync(['foo', 'blob', 4], {animal:'cat', name:'mog'});

    const result = await firebaseReadWithFilterAsync(['foo', 'bar'], 'animal', 'cat');
    expect(result).toEqual([{animal:'cat', name:'fluffy'}, {animal:'cat', name:'whiskers'}]);    
});

test('firebaseUpdateAsync', async () => {
    await firebaseWriteAsync(['foo', 'won', 1], {animal: 'cat', name: 'fluffy'});
    await firebaseUpdateAsync(['foo', 'won', 1], {name: 'whiskers'});
    const result = await firebaseReadAsync(['foo', 'won', 1]);
    expect(result).toEqual({animal: 'cat', name: 'whiskers'});
});

test('firebaseGetUserAsync', async () => {
   const user = await firebaseGetUserAsync(); 
   expect(user.displayName).toBe('Test User');
});

test('createNewKey', async () => {
    const key1 = await createNewKey();
    const key2 = await createNewKey();
    expect(key1).toBe(1);
    expect(key2).toBe(2);
});

test('writeGlobalAsync', async () => {
    await writeGlobalAsync({siloKey: 'cbc', 
        structureKey: 'question', instanceKey: 'demo', 
        key: 'name', value: 'Test'});
    const result = await firebaseReadAsync(['silo', 'cbc', 'structure', 'question', 'instance', 'demo', 'global', 'name']);
    expect(result).toBe('Test');

    const result2 = await readGlobalAsync({siloKey: 'cbc', 
        structureKey: 'question', instanceKey: 'demo', key: 'name'});
    expect(result2).toBe('Test');
})

test('stringToFbKey', async () => {
    const result = stringToFbKey('foo.bar#baz');
    expect(result).toBe('foo%dbar%hbaz');

    const result2 = fbKeyToString('foo%dbar%hbaz');
    expect(result2).toBe('foo.bar#baz');
});

