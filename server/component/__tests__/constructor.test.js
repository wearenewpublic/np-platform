const { readObjectAsync } = require("../../util/firebaseutil");
const { runConstructorApi } = require("../constructor");

describe('runConstructorApi', () => {
    test('No constructor', async () => {
        const result = await runConstructorApi({siloKey: 'cbc', 
            structureKey: 'wibble', instanceKey: 'demo'});
        expect(result.success).toBe(false);
    });

    test('Null constructor', async () => {
        const result = await runConstructorApi({siloKey: 'cbc', 
            structureKey: 'simplecomments', instanceKey: 'demo'});
        expect(result.success).toBe(true);
    });

    test('Profile constructor', async () => {
        const result = await runConstructorApi({siloKey: 'cbc', 
            structureKey: 'profile', instanceKey: 'testuser'});
        expect(result.success).toBe(true);
        const profile = await readObjectAsync({siloKey: 'cbc', 
            structureKey: 'profile', instanceKey: 'testuser', 
            collection: 'persona', key: 'testuser'});
        expect(profile.name).toBe('Test User');
    });
});
