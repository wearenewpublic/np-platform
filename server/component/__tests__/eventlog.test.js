const { readObjectAsync, firebaseReadAsync, firebaseWriteAsync } = require("../../util/firebaseutil");
const { mockServerStore } = require("../../util/serverstore");
const { getTestData, clearTestData } = require("../../util/testutil");
const { logEventApi, setSessionUserApi, getEventsApi, getSessionsApi, getSingleSessionApi } = require("../eventlog");

describe('logEventApi', () => {
    test('New Session', async () => {
        const result = await logEventApi({siloKey: 'cbc', 
            userId: 'testuser',
            structureKey: 'wibble', instanceKey: 'demo',
            isNewSession: true, sessionKey: 'newsession',
            eventType: 'test', params: {foo: 'bar'}
        });
        const event = await firebaseReadAsync(['log', 'event', result.eventKey]);
        expect(event.eventType).toBe('test');         

        const session = await firebaseReadAsync(['log', 'session', 'newsession']);
        expect(session.userName).toBe('Test User');

        expect(getTestData()).toMatchSnapshot();
    });

    test('Existing Session', async () => {
        jest.useFakeTimers();
        jest.setSystemTime(1000);

        await firebaseWriteAsync(['log', 'session', 'newsession'], {
            userId: 'testuser', siloKey: 'cbc', userName: 'Test User', userPhoto: null,
            startTime: 10, endTime: 10
        });
        await logEventApi({siloKey: 'cbc', 
            userId: 'testuser',
            structureKey: 'wibble', instanceKey: 'demo',
            isNewSession: false, sessionKey: 'newsession',
            eventType: 'test', params: {foo: 'bar'}
        });

        const session = await firebaseReadAsync(['log', 'session', 'newsession']);
        expect(session.endTime).toBe(1000);

        expect(getTestData()).toMatchSnapshot();
    });
});

test('setSessionUserApi', async () => {
    // Log an event before we have logged in
    await logEventApi({siloKey: 'cbc', 
        userId: null,
        structureKey: 'wibble', instanceKey: 'demo',
        isNewSession: true, sessionKey: 'newsession',
        eventType: 'test', params: {foo: 'bar'}
    });  
    
    // a second event
    await logEventApi({siloKey: 'cbc', 
        userId: null,
        structureKey: 'wibble', instanceKey: 'demo',
        isNewSession: false, sessionKey: 'newsession',
        eventType: 'test', params: {foo: 'blob'}
    });

    const session = await firebaseReadAsync(['log', 'session', 'newsession']);
    expect(session.userId).toBe(null);        

    // update the session with the user, now they have logged in
    await setSessionUserApi({sessionKey: 'newsession', userId: 'testuser'});
    const session2 = await firebaseReadAsync(['log', 'session', 'newsession']);
    expect(session2.userId).toBe('testuser');        
});

describe('getEventsApi', () => {
    test('Not authorized', async () => {
        const serverstore = mockServerStore({userEmail: 'bad@bad.com'});
        expect(async () => {
            await getEventsApi({serverstore});
        }).rejects.toThrow('Not authorized');
    });

    test('Event Filters', async () => {
        clearTestData();
        await firebaseWriteAsync(['log', 'event', '1'], {
            siloKey: 'cbc', eventType: 'test', sessionKey: 'a'
        });
        await firebaseWriteAsync(['log', 'event', '2'], {
            siloKey: 'cbc', eventType: 'bla', sessionKey: 'b'
        });
        await firebaseWriteAsync(['log', 'event', '3'], {
            siloKey: 'rc', eventType: 'test', sessionKey: 'b'
        });

        const serverstore = mockServerStore({userEmail: 'rob@newpublic.org'});
        const result = await getEventsApi({serverstore});
        expect(Object.keys(result)).toEqual(['1','2', '3']);

        const result2 = await getEventsApi({serverstore, filterSiloKey: 'cbc'});
        expect(Object.keys(result2)).toEqual(['1','2']);

        const result3 = await getEventsApi({serverstore, eventType: 'test'});
        expect(Object.keys(result3)).toEqual(['1','3']);

        const result4 = await getEventsApi({serverstore, sessionKey: 'b'});
        expect(Object.keys(result4)).toEqual(['2','3']);
    });
})

test('getSessionsApi', async () => {
    clearTestData();
    await firebaseWriteAsync(['log', 'session', '1'], {
        siloKey: 'cbc', startTime: 1, endTime: 2
    });
    await firebaseWriteAsync(['log', 'session', '2'], {
        siloKey: 'cbc', startTime: 3, endTime: 4
    });
    await firebaseWriteAsync(['log', 'session', '3'], {
        siloKey: 'rc', startTime: 5, endTime: 6
    });

    const serverstore = mockServerStore({userEmail: 'rob@newpublic.org'});
    const result = await getSessionsApi({serverstore});
    expect(Object.keys(result)).toEqual(['1','2','3']);

    const result2 = await getSessionsApi({serverstore, filterSiloKey: 'cbc'});
    expect(Object.keys(result2)).toEqual(['1','2']);
});

test('getSingleSessionApi', async () => {
    clearTestData();
    firebaseWriteAsync(['log', 'session', '1'], {
        siloKey: 'cbc', startTime: 1, endTime: 2
    });

    const serverstore = mockServerStore({userEmail: 'rob@newpublic.org'});
    const result = await getSingleSessionApi({serverstore, sessionKey: '1'});
    expect(result.startTime).toBe(1);
})

