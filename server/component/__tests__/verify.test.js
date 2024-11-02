const { addVerifiedUsersAsync, getVerifiedUsersAsync, getVerificationStatusAsync, setVerificationStatusAsync } = require('../verify');
const { mockServerStore } = require('../../util/serverstore');
const { stringToFbKey } = require('../../util/firebaseutil');
const { getTestData } = require('../../util/testutil');

jest.mock('../../util/firebaseutil', () => ({
    ...jest.requireActual('../../util/firebaseutil'),
    getUserByEmailAsync: jest.fn(),
}));
jest.mock('../profile', () => ({
    updateProfileAsync: jest.fn(),
}));

const testEmail1 = "celebrity@example.com";
const testEmail2 = "user@example.com";
const encodedEmail1 = stringToFbKey(testEmail1.toLowerCase());
const encodedEmail2 = stringToFbKey(testEmail2.toLowerCase());

test('addVerifiedUsersAsync', async () => {
    const serverstore = mockServerStore();

    await addVerifiedUsersAsync({
        serverstore, 
        emails: `${testEmail1}, ${testEmail2}`
    });

    serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});

test('getVerifiedUsersAsync', async () => {
    const serverstore = mockServerStore();
    serverstore.setModulePrivate('verify', ['verifiedUsers'], [encodedEmail1, encodedEmail2]);

    serverstore.commitDataAsync();
    const result = await getVerifiedUsersAsync({ serverstore });
    expect(result).toEqual([testEmail1.toLowerCase(), testEmail2.toLowerCase()]);
    expect(getTestData()).toMatchSnapshot();
});

test('getVerificationStatusAsync', async () => {
    const serverstore = mockServerStore({ userEmail: testEmail1 });
    serverstore.setModulePrivate('verify', ['verifiedUsers'], [encodedEmail1]);
    serverstore.commitDataAsync();

    const verifiedStatus = await getVerificationStatusAsync({ serverstore, email: testEmail1 });
    const unverifiedStatus = await getVerificationStatusAsync({ serverstore, email: testEmail2 });

    expect(verifiedStatus).toBe("verified");
    expect(unverifiedStatus).toBe("unverified");
});

test('setVerificationStatusAsync', async () => {
    const serverstore = mockServerStore({ userEmail: testEmail1, userId: 'user1' });
    serverstore.setModulePrivate('verify', ['verifiedUsers'], [encodedEmail1]);
    serverstore.commitDataAsync();

    const result = await setVerificationStatusAsync({ serverstore });
    expect(result).toBe("verified");

    serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});