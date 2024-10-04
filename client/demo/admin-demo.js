import { CLICK, INPUT, POPUP, POPUP_CLOSE } from "../system/demo";
import { AdminUsersScreen } from "../feature/AdminUsersFeature";
import { stringToFbKey } from "../util/firebase";
import { AdminScreen, AdminStructure } from "../structure/admin";

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
                    {
                        label: 'Admin Dash', key: 'admindashboard', storySets: adminDashStorySets,
                    }
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

function adminDashStorySets() {return [
    {
        label: 'Admin Dash',
        content: <AdminScreen />,
        roles: ['Owner'],
        config: AdminStructure.defaultConfig,
        stories: [
            {label: 'Go to Component Demo', actions: [
                CLICK('Component Demo')
            ]},
            {label: 'Go to Event Log', actions: [
                CLICK('Event Log')
            ]},
        ]
    },
    {
        label: 'Not an admin',
        content: <AdminScreen />,
    }
]}
