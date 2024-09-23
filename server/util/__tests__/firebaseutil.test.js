const { read } = require("fs");
const { setFirebaseAdmin, firebaseWriteAsync, firebaseReadAsync, firebaseReadWithFilterAsync, firebaseUpdateAsync, firebaseGetUserAsync, createNewKey, writeGlobalAsync, readGlobalAsync, stringToFbKey, fbKeyToString, urlToKey, keyToUrl, checkPathsNotOverlapping, checkNoUndefinedKeysOrValues, setObjectAsync, readObjectAsync, writeCollectionAsync, expandPath, getOrCreateUserAsync, firebaseGetUserListAsync } = require("../firebaseutil");
const { fakeFirebaseAdmin, clearTestData, createUser, getUserByEmail, listUsers } = require("../testutil");


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
    expect(result).toEqual({
        '1': {animal:'cat', name:'fluffy'},
        '2': {animal:'cat', name:'whiskers'}
    });
});

test('firebaseUpdateAsync', async () => {
    await firebaseWriteAsync(['foo', 'won', 1], {animal: 'cat', name: 'fluffy'});
    await firebaseUpdateAsync(['foo', 'won', 1], {name: 'whiskers'});
    const result = await firebaseReadAsync(['foo', 'won', 1]);
    expect(result).toEqual({animal: 'cat', name: 'whiskers'});
});

test('firebaseUpdateAsync deep', async () => {
    await firebaseWriteAsync(['foo', 'won', 1], {animal: 'cat', name: 'fluffy'});
    await firebaseUpdateAsync(['foo'], {'won/1/name': 'whiskers', 'won/1/color': 'grey'});
    const result = await firebaseReadAsync(['foo', 'won', 1]);
    expect(result).toEqual({animal: 'cat', name: 'whiskers', color: 'grey'});

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

test('setObjectAsync', async () => {
    await setObjectAsync({siloKey: 'cbc', structureKey: 'struct', instanceKey: 'inst', collection: 'coll', key: 'key', value: 'value'});
    const result = await readObjectAsync({siloKey: 'cbc', structureKey: 'struct', instanceKey: 'inst', collection: 'coll', key: 'key'});
    expect(result).toBe('value');
});    

test('writeCollectionAsync', async () => {
    await writeCollectionAsync({siloKey: 'cbc', structureKey: 'struct', instanceKey: 'inst', collection: 'coll', items: {key1: 'value1', key2: 'value2'}});
    const result = await readObjectAsync({siloKey: 'cbc', structureKey: 'struct', instanceKey: 'inst', collection: 'coll', key: 'key1'});
    expect(result).toBe('value1');
});

test('stringToFbKey', async () => {
    const result = stringToFbKey('foo.bar#baz');
    expect(result).toBe('foo%dbar%hbaz');

    const result2 = fbKeyToString('foo%dbar%hbaz');
    expect(result2).toBe('foo.bar#baz');
});

test('urlToKey', async () => {
    const url = 'https://www.google.com';

    const result = urlToKey(url);
    expect(result).toBe('https%3A%25f%25fwww%25dgoogle%25dcom');

    expect(keyToUrl(result)).toBe(url);
});

test('keyToUrl', async () => {
    const result = keyToUrl('https%3A%25f%25fwww%25dgoogle%25dcom');
    expect(result).toBe('https://www.google.com');
})

test('checkPathsNotOverlapping', () => {
    checkPathsNotOverlapping(['foo/bar', 'foo/baz']);
    checkPathsNotOverlapping(['foo/bar', 'foo/barter']);
    checkPathsNotOverlapping(['silo/global/module-public/profile/pseudonym/wibbleblo', 'silo/global/module-public/profile/pseudonym/wibble']);
    expect(() => 
        checkPathsNotOverlapping(['foo/bar', 'foo/bar'])
    ).toThrow();
    expect(() => 
        checkPathsNotOverlapping(['foo/bar', 'foo/bar/wib'])
    ).toThrow();
});

test('checkNoUndefinedKeysOrValues', () => {
    checkNoUndefinedKeysOrValues({foo: 'bar', baz: 'qux'});
    checkNoUndefinedKeysOrValues('hello');
    expect(() => 
        checkNoUndefinedKeysOrValues({foo: 'bar', baz: undefined})
    ).toThrow();
    expect(() =>
        checkNoUndefinedKeysOrValues({foo: 'bar', baz: {qux: 'quux', wibble: undefined}})
    ).toThrow();
}); 

test('expandPath', () => {
    const result = expandPath(['foo', 'bar', 'baz']);
    expect(result).toEqual('foo/bar/baz');

    expect(() => 
        expandPath(['foo', null, 'baz', 'qux'])
    ).toThrow();
});

test('getOrCreateUser', async () => {
    createUser.mockResolvedValueOnce({uid: 'userRob'});
    getUserByEmail.mockRejectedValue(new Error('User not found'));

    await getOrCreateUserAsync({email: 'rob@rob.org', name: 'Rob Zilla', photoUrl: 'https://rob.com/rob.jpg'});
    expect(createUser).toBeCalledWith({
        email: 'rob@rob.org', displayName: 'Rob Zilla', 
        photoURL: 'https://rob.com/rob.jpg'
    });
});

test('firebaseGetUserListAsync', async () => {
    listUsers.mockResolvedValueOnce({users: [{uid: 'user1'}, {uid: 'user2'}], pageToken: 'token'});
    listUsers.mockResolvedValueOnce({users: [{uid: 'user3'}, {uid: 'user4'}]});

    const userList = await firebaseGetUserListAsync();
    expect(userList.length).toEqual(4);
 });
