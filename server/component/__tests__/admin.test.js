
jest.mock('../../util/firebaseutil');

const { clearMockFirebaseAsync, firebaseWriteAsync } = require('../../util/firebaseutil');
const { getIsUserAdminAsync } = require('../admin');


test('getIsUserAdminAsync', async () => {
    clearMockFirebaseAsync();
    const isAdmin = await getIsUserAdminAsync({siloKey: 'cbc', userEmail: 'rob@newpublic.org'});
    expect(isAdmin).toBe(false);

    await firebaseWriteAsync(['silo', 'cbc', 'module-public', 'admin', 'adminEmails'], 'rob@newpublic.org');
    const isAdmin2 = await getIsUserAdminAsync({siloKey: 'cbc', userEmail: 'rob@newpublic.org'});
    expect(isAdmin2).toBe(true);

    const isAdmin3 = await getIsUserAdminAsync({siloKey: 'cbc', userEmail: 'admin@admin.org'});
    expect(isAdmin3).toBe(true);

});