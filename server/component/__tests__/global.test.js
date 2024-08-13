const { mockServerStore } = require("../../util/serverstore");
const { setGlobalPropertyApi } = require("../global");

jest.mock('../../util/firebaseutil');

describe('setGlobalPropertyApi', () => {
    test('Authorized', async () => {
        const serverstore = mockServerStore();

        await setGlobalPropertyApi({serverstore, key: 'test', value: 'hello'});
        const value = await serverstore.getGlobalPropertyAsync('test');
        
        expect(value).toBe('hello');
    });
});

