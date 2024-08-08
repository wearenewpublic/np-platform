const { readGlobalAsync, firebaseWriteAsync } = require("../../util/firebaseutil");
const { setGlobalPropertyApi } = require("../global");

jest.mock('../../util/firebaseutil');

describe('setGlobalPropertyApi', () => {
    test('Not authorized', async () => {
        const result = await setGlobalPropertyApi({userEmail: 'baduser@bad.com', 
            siloKey: 'cbc', structureKey: 'question', 
            instanceKey: 'demo', key: 'test', value: 'test'
        });
        expect(result.success).toBe(false);
    });

    test('Authorized', async () => {
        firebaseWriteAsync(['silo', 'cbc', 'module-public', 'admin', 'adminEmails'], 'good@good.com');

        const result = await setGlobalPropertyApi({userEmail: 'good@good.com', 
            siloKey: 'cbc', structureKey: 'question', 
            instanceKey: 'demo', key: 'test', value: 'test'
        });
        expect(result.success).toBe(true);

        const value = await readGlobalAsync({siloKey: 'cbc', structureKey: 'question', instanceKey: 'demo', key: 'test'});
        expect(value).toBe('test');
    });
});

