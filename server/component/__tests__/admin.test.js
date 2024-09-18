const { addAdminUsersAsync, getAdminUsersAsync, setAdminRolesAsync } = require('../admin');
const { logData, getTestData, getUserByEmail } = require('../../util/testutil');
const { mockServerStore } = require('../../util/serverstore');
const e = require('cors');

test('addAdminUsersAsync', async () => {
    const serverstore = mockServerStore();

    getUserByEmail.mockResolvedValueOnce({uid: 'userRob'});
    getUserByEmail.mockResolvedValueOnce({uid: 'userBob'});

    await addAdminUsersAsync({serverstore, 
        emails: "rob@rob.org, bob@bob.org", 
        roles: ['Moderator', 'Analyst']});
    serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});

test('getAdminUsersAsync', async () => {
    const serverstore = mockServerStore();
    serverstore.setModulePrivate('admin', ['userRoles', 'testuser'], JSON.stringify(['Moderator', 'Analyst']));

    serverstore.commitDataAsync();

    const result = await getAdminUsersAsync({serverstore});
    expect(result).toMatchSnapshot();
});

test('setAdminRolesAsync', async () => {
    const serverstore = mockServerStore();
    serverstore.setModulePrivate('admin', ['userRoles', 'testuser'], JSON.stringify(['Moderator', 'Analyst']));
    serverstore.commitDataAsync();

    await setAdminRolesAsync({serverstore, adminKey: 'testuser', roles: ['Owner', 'Moderator']});
    serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();
});