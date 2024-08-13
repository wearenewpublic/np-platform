const { clearMockFirebaseAsync, firebaseWriteAsync, setFirebaseAdmin, firebaseReadAsync } = require('../firebaseutil');
const { ServerStore, mockServerStore } = require('../serverstore');
const { fakeFirebaseAdmin } = require('../testutil');
const { getIsUserAdminAsync } = require('../admin');




test('getIsUserAdminAsync', async () => {
    const serverstore = mockServerStore({userEmail: 'rob@newpublic.org'});
    const isAdmin = await getIsUserAdminAsync({serverstore});
    expect(isAdmin).toBe(false);

    serverstore.setModulePublicAsync('admin', ['adminEmails'], 'rob@newpublic.org');
    // await firebaseWriteAsync(['silo', 'cbc', 'module-public', 'admin', 'adminEmails'], 'rob@newpublic.org');
    const isAdmin2 = await getIsUserAdminAsync({serverstore});
    expect(isAdmin2).toBe(true);

    const serverstore2 = mockServerStore({userEmail: 'admin@admin.org'});
    const isAdmin3 = await getIsUserAdminAsync({serverstore: serverstore2});
    expect(isAdmin3).toBe(true);
});

