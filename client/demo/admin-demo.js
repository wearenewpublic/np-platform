import { CLICK, INPUT, POPUP, POPUP_CLOSE } from "../component/demo";
import { AdminUsersScreen } from "../feature/AdminUsersFeature";
import { stringToFbKey } from "../util/firebase";

export const AdminDemo = {
    key: 'demo_admin',
    name: 'Admin Demo',
    config: {
        componentSections: [
            {
                label: 'Internal Tools', key: 'internal', pages: [
                    {
                        label: 'Admin Users', key: 'adminusers', storySets: adminUsersStorySets
                    },
                ]
            },
        ]
    }
}

function adminUsersStorySets() { return [
    {
        label: 'Lacks capability',
        content: <AdminUsersScreen />,
        serverCall: {admin: {
            getAdminUsers: () => null,
        }}
    },
    {
        label: 'Admin Users',
        content: <AdminUsersScreen />,
        roles: ['Owner'],
        collections: {fakeAdmin: [
            {key: 'admin@admin%dorg', roles: ['Owner'], email: 'admin@admin.org'},
            {key: 'bob@bob%dcom', roles: ['Moderator'], email: 'bob@bob.com'}
        ]},
        serverCall: {admin: {
            getAdminUsers: ({datastore}) => datastore.getCollection('fakeAdmin'),
            setAdminRoles: ({datastore, email, roles}) => {
                datastore.updateObject('fakeAdmin', stringToFbKey(email), {roles});
            },
            addAdminUsers: ({datastore, emails, roles}) => {
                datastore.addObject('fakeAdmin', {roles, email: 'fake@fake.com'});
            }
        }},
        stories: [
            {label: 'Set roles', actions: [
                CLICK('Moderator'),
                POPUP(CLICK('Developer')),
                POPUP_CLOSE()
            ]},
            {label: 'Add user', actions: [
                INPUT('new-emails', 'fake@fake.com'),
                CLICK('Select roles'),
                POPUP(CLICK('Editorial')),
                POPUP_CLOSE(),
                CLICK('Add Admins')
            ]}
        ]
    }
]}