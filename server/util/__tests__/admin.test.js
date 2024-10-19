import {mockServerStore} from '../serverstore';
import {getIsUserAdminAsync} from '../admin';

test('getIsUserAdminAsync', async () => {
    const serverstore = mockServerStore({userEmail: 'rob@newpublic.org'});
    const isAdmin = await getIsUserAdminAsync({serverstore});
    expect(isAdmin).toBe(false);

    serverstore.setModulePrivate('admin', ['userRoles', 'rob@newpublic%dorg'], JSON.stringify(['Developer']));
    serverstore.commitDataAsync();

    const isAdmin2 = await getIsUserAdminAsync({serverstore});
    expect(isAdmin2).toBe(true);

    const serverstore2 = mockServerStore({userEmail: 'admin@admin.org'});
    const isAdmin3 = await getIsUserAdminAsync({serverstore: serverstore2});
    expect(isAdmin3).toBe(true);
});

