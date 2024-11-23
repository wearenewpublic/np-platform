const { coreComponents } = require("../../component");
const { callApiFunctionAsync, parsePath, handleApiRequestAsync, handleJsonRequestAsync, handleMultipartRequest, handleMultipartRequestAsync } = require("../api");
const { logData, verifyIdToken, getTestData } = require("../testutil");
const { Readable } = require("stream");

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

const req = {
    method: 'POST',
    path: '/api/global/setGlobalProperty',
    headers: {
        'content-type': 'application/json',
        authorization: 'Bearer login-token'
    },
    query: {
        siloKey: 'testSilo',
        structureKey: 'testStruct',
        instanceKey: 'testInstance',
        key: 'testKey',
        value: 'testValue',
    }
}

test('handleJsonRequest', async () => {
    const res = {
        status: jest.fn(),
        send: jest.fn()
    }
    verifyIdToken.mockReturnValue({
        uid: 'testuser',
        email: 'admin@admin.org'
    });
    await handleJsonRequestAsync(req, res, coreComponents);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith(JSON.stringify({success: true, data: null}));
    expect(getTestData()).toMatchSnapshot();
});

describe('handleApiRequest', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    }

    test('POST Json', async () => {
        verifyIdToken.mockReturnValue({
            uid: 'testuser',
            email: 'admin@admin.org'
        });    
        await handleApiRequestAsync(req, res, coreComponents);    
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(JSON.stringify({success: true, data: null}));    
    });
    test('GET', async () => {
        const getReq = {...req, method: 'GET'};
        verifyIdToken.mockReturnValue({
            uid: 'testuser',
            email: 'admin@admin.org'
        });
        await handleApiRequestAsync(getReq, res, coreComponents);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(JSON.stringify({success: true, data: null}));
    });
    test('OTIONS', async () => {
        const optionsReq = {...req, method: 'OPTIONS'};
        await handleApiRequestAsync(optionsReq, res, coreComponents);
        expect(res.status).toBeCalledWith(200);
    });
    test('Unsupported Content-Type', async () => {
        const badReq = {...req, headers: {'content-type': 'text/plain'}};
        await handleApiRequestAsync(badReq, res, coreComponents);
        expect(res.status).toBeCalledWith(415);
        expect(res.send).toBeCalledWith({error: 'Unsupported Content-Type: text/plain'});
    });
    test('Unsupported HTTP Method', async () => {
        const badReq = {...req, method: 'PUT'};
        await handleApiRequestAsync(badReq, res, coreComponents);
        expect(res.status).toBeCalledWith(415);
        expect(res.send).toBeCalledWith({error: 'Unsupported HTTP Method: PUT'});
    });
})

test('handleMultipartRequest', async () => {
    const boundary = '----WebKitFormBoundary123456789';
    const headers = {
        'content-type': `multipart/form-data; boundary=${boundary}`,
        authorization: 'Bearer login-token'
    };

    const body = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="siloKey"',
        '',
        'testSilo',
        `--${boundary}`,
        'Content-Disposition: form-data; name="structureKey"',
        '',
        'testStruct',
        `--${boundary}`,
        'Content-Disposition: form-data; name="instanceKey"',
        '',
        'testInstance',
        `--${boundary}`,
        'Content-Disposition: form-data; name="key"',
        '',
        'testKey',
        `--${boundary}`,
        'Content-Disposition: form-data; name="value"',
        '',
        'testValue',
        `--${boundary}--`,
    ].join('\r\n');

    const req = new Readable();
    req.push(body);
    req.push(null);
    req.rawBody = Buffer.from(body);
    req.headers = headers;
    req.path = '/api/global/setGlobalProperty';

    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    }
    verifyIdToken.mockReturnValue({
        uid: 'testuser',
        email: 'admin@admin.org'
    });
    await handleMultipartRequestAsync(req, res, coreComponents);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith(JSON.stringify({success: true, data: null}));
    expect(getTestData()).toMatchSnapshot();

});

