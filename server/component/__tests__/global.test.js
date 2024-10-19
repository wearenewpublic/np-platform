import {mockServerStore} from "../../util/serverstore";
import {logData} from "../../util/testutil";
import {setGlobalPropertyApi} from "../global";

describe('setGlobalPropertyApi', () => {
    test('Authorized', async () => {
        const serverstore = mockServerStore();

        await setGlobalPropertyApi({serverstore, key: 'test', value: 'hello'});
        serverstore.commitDataAsync();
    
        const value = await serverstore.getGlobalPropertyAsync('test');
        
        expect(value).toBe('hello');
    });
});

