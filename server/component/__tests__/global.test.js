const { mockServerStore } = require("../../util/serverstore");
const { logData } = require("../../util/testutil");
const { setGlobalPropertyApi } = require("../global");

describe('setGlobalPropertyApi', () => {
    test('Authorized', async () => {
        const serverstore = mockServerStore();

        await setGlobalPropertyApi({serverstore, key: 'test', value: 'hello'});
        serverstore.commitDataAsync();
    
        const value = await serverstore.getGlobalPropertyAsync('test');
        
        expect(value).toBe('hello');
    });
});

