const { readObjectAsync } = require("../../util/firebaseutil");
const { mockServerStore } = require("../../util/serverstore");
const { runConstructorApi } = require("../constructor");


describe('runConstructorApi', () => {
    test('No constructor', async () => {
        await expect(async () => {
            const serverstore = mockServerStore();
            await runConstructorApi({serverstore});    
        }).rejects.toThrow('No constructor found for testStruct');
    });

    test('Null constructor', async () => {
        const serverstore = mockServerStore({structureKey: 'simplecomments'});
        await runConstructorApi({serverstore});
    });

    test('Profile constructor', async () => {
        const serverstore = mockServerStore({structureKey: 'profile', instanceKey: 'testuser'});
        await runConstructorApi({serverstore});
        
        const profile = await serverstore.getObjectAsync('profile', 'testuser');
        expect(profile.name).toBe('Test User');
    });
});

