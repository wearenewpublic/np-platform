import {coreComponents} from "../../component";
import {callApiFunctionAsync, parsePath} from "../api";
import {logData, verifyIdToken, getTestData} from "../testutil";

test('null', () => {
    expect(1).toBe(1);
})

test('parsePath', () => {
    const path = '/api/globals/setGlobalProperty';
    const {componentId, apiId} = parsePath(path);
    expect(componentId).toBe('globals');
    expect(apiId).toBe('setGlobalProperty');
});

describe('callApiFunctionAsync', () => {
    test('authorized', async () => {
        const req = {
            path: '/api/global/setGlobalProperty',
            headers: {
                authorization: 'Bearer login-token'
            }, query: {
                siloKey: 'testSilo',
                structureKey: 'testStruct',
                instanceKey: 'testInstance',
                key: 'testKey',
                value: 'testValue',
            }
        };
        verifyIdToken.mockReturnValue({
            uid: 'testuser',
            email: 'admin@admin.org'
        });
        const result = await callApiFunctionAsync(req, {}, coreComponents);
        expect(result.statusCode).toBe(200);
        expect(getTestData()).toMatchSnapshot();
    });

    test('unauthorized', async () => {
        const req = {
            path: '/api/global/setGlobalProperty',
            headers: {
                authorization: 'Bearer login-token'
            }, 
            query: {
                siloKey: 'testSilo',
                structureKey: 'testStruct',
                instanceKey: 'testInstance',
                key: 'testKey',
                value: 'testValue',
            }
        };
        verifyIdToken.mockReturnValue({
            uid: 'baduser',
            email: 'bad@bad.org'
        });
        const result = await callApiFunctionAsync(req, {}, coreComponents);
        expect(result.statusCode).toBe(401);
    });

    test('missing component', async () => {
        const req = {
            path: '/api/foo/wible'
        };
        const result = await callApiFunctionAsync(req, {}, coreComponents);
        expect(result.statusCode).toBe(400);
     });
    
});