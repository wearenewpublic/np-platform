import { useState } from "react"
import { ConversationScreen, HorizBox, Pad, PadBox } from "../component/basics"
import { CTAButton } from "../component/button"
import { Checkbox, FormField } from "../component/form"
import { Heading, TextField, UtilityText } from "../component/text"
import { getRoles } from "../data/roles"
import { useDatastore } from "../util/datastore"
import { View } from "react-native"
import { toBool } from "../util/util"
import { Popup } from "../platform-specific/popup"
import { useServerCallResult } from "../util/servercall"
import { colorTextGrey } from "../component/color"

export const AdminUsersFeature = {
    name: 'Admin Users',
    key: 'adminusers',
    subscreens: {
        adminUsers: AdminUsersScreen,
    },
    config: {
        quickLinks: [
            {label: 'Admin Users', screenKey: 'adminUsers'},
        ]
    }
}

function AdminUsersScreen() {
    const [usersSince, setUsersSince] = useState(Date.now());
    const datastore = useDatastore();

    const adminUsers = useServerCallResult('admin', 'getAdminUsers', {usersSince});
    console.log('adminUsers', adminUsers); 
    return <ConversationScreen pad>
        <Pad />
        <Heading level={1} label='Admin Users' />
        <Pad />
        <AdminUserList adminUsers={adminUsers} />
        <Pad />   
        <AddAdminUsers onUsersAdded={() => setUsersSince(Date.now())}/>
    </ConversationScreen>
}

function AdminUserList({adminUsers}) {
    if (!adminUsers) {
        return <UtilityText label='Loading admin users...' />
    }
    return <View>
        {adminUsers.map(adminUser => <AdminUser key={adminUser.key} adminUser={adminUser} />)}
    </View>
}


function AdminUser({adminUser}) {
    const [roles, setRoles] = useState(null);
    const [inProgress, setInProgress] = useState(false);
    const datastore = useDatastore();

    async function setSelectedRoles(selectedRoles) {
        setRoles(selectedRoles);
        setInProgress(true);
        await datastore.callServerAsync('admin', 'setAdminRoles', {adminKey: adminUser.key, roles: selectedRoles});
        setInProgress(false);
    }

    console.log('roles', roles);
    return <PadBox vert={4}>
        <HorizBox spread center>
            <View>
                <UtilityText label={adminUser.email} />
                {toBool(inProgress) && <UtilityText type='tiny' color={colorTextGrey} label='Updating roles...' />}
            </View>
            <RoleSelectorPopup selectedRoles={roles ?? adminUser.roles} setSelectedRoles={setSelectedRoles} />
        </HorizBox>
    </PadBox>
}

function AddAdminUsers({onUsersAdded}) {
    const [emails, setEmails] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [inProgress, setInProgress] = useState(false);
    const datastore = useDatastore();

    async function onAdd() {
        setInProgress(true);
        await datastore.callServerAsync('admin', 'addAdminUsers', {emails, roles: selectedRoles})
        onUsersAdded();
        setInProgress(false);
        setEmails('');
        setSelectedRoles([]);
    }

    return <FormField label='Add new admin users'>
        <TextField value={emails} onChange={setEmails} placeholder='Emails of users to add' />
        <Pad />
        {toBool(emails) &&  <HorizBox>
            <RoleSelectorPopup selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles} />
            <Pad />
            <CTAButton compact disabled={inProgress || selectedRoles.length == 0} label='Add Admins' onPress={onAdd} />
        </HorizBox>}
        {toBool(inProgress) && <UtilityText label='Adding Admins...' />}
    </FormField>
}

function RoleSelectorPopup({selectedRoles, setSelectedRoles}) {
    function popupContent() {
        return <RoleSelector selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles}/>
    }

    const roleString = selectedRoles.length ? selectedRoles.join(', ') : 'Select roles';
    return <Popup popupContent={popupContent} alignRight>
        <CTAButton type='secondary' text={roleString}/>
    </Popup>
}

function RoleSelector({selectedRoles, setSelectedRoles}) {
    const roles = getRoles();
    const roleKeys = Object.keys(roles);

    function onToggleRole(roleKey, value) {
        if (value) {
            setSelectedRoles([...selectedRoles, roleKey]);
        } else {
            setSelectedRoles(selectedRoles.filter(selectedRole => selectedRole !== roleKey));
        }
    }

    return <View style={{maxWidth: 300}}>
        {roleKeys.map(roleKey => 
            <Checkbox key={roleKey} label={roleKey} 
                value={selectedRoles.includes(roleKey)} 
                onChange={value => onToggleRole(roleKey, value)} 
            />
        )}
    </View>
}   

