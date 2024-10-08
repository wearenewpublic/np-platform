import { useState } from "react"
import { ConversationScreen, HorizBox, Pad, PadBox } from "../component/basics"
import { CTAButton, Popup } from "../component/button"
import { Checkbox, FormField } from "../component/form"
import { Heading, TextField, UtilityText } from "../component/text"
import { getRoles } from "../component/admin"
import { useDatastore } from "../util/datastore"
import { View } from "react-native"
import { toBool } from "../util/util"
import { useServerCallResult } from "../util/servercall"
import { colorTextGrey } from "../component/color"
import { useHasCapability } from "../component/admin"
import { Banner } from "../component/banner"

export const AdminUsersFeature = {
    name: 'Admin Users',
    key: 'adminusers',
    subscreens: {
        adminUsers: AdminUsersScreen,
    },
    config: {
        quickLinks: [
            {label: 'Manage Admin Users', screenKey: 'adminUsers'},
        ]
    },
    capabilities: ['modify-admins']
}

export function AdminUsersScreen() {
    const [refreshKey, setRefreshKey] = useState(0);
    const hasAccess = useHasCapability('adminusers/modify-admins');
    const adminUsers = useServerCallResult('admin', 'getAdminUsers', {refreshKey});

    if (hasAccess === false) {
        return <Banner><UtilityText label='You do not have access to this feature'/></Banner>
    }

    return <ConversationScreen pad>
        <Pad />
        <Heading level={1} label='Admin Users' />
        <Pad />
        <AdminUserList adminUsers={adminUsers} />
        <Pad />   
        <AddAdminUsers onUsersAdded={() => setRefreshKey(refreshKey + 1)}/>
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
        await datastore.callServerAsync('admin', 'setAdminRoles', {email: adminUser.email, roles: selectedRoles});
        setInProgress(false);
    }

    return <PadBox vert={4}>
        <HorizBox spread center>
            <View>
                <UtilityText text={adminUser.email} />
                {toBool(inProgress) && <UtilityText type='tiny' color={colorTextGrey} label='Updating roles...' />}
            </View>
            <RoleSelectorPopup alignRight selectedRoles={roles ?? adminUser.roles} setSelectedRoles={setSelectedRoles} />
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
        await onUsersAdded();
        setInProgress(false);
        setEmails('');
        setSelectedRoles([]);
    }

    return <FormField label='Add new admin users'>
        <TextField testID='new-emails' value={emails} onChange={setEmails} placeholder='Emails of users to add' />
        <Pad />
        {toBool(emails) &&  <HorizBox>
            <RoleSelectorPopup selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles} />
            <Pad />
            <CTAButton size='compact' disabled={inProgress || selectedRoles.length == 0} label='Add Admins' onPress={onAdd} />
        </HorizBox>}
        {toBool(inProgress) && <UtilityText label='Adding Admins...' />}
    </FormField>
}

function RoleSelectorPopup({selectedRoles, setSelectedRoles, alignRight=false}) {
    function popupContent() {
        return <RoleSelector selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles}/>
    }

    const roleString = selectedRoles.length ? selectedRoles.join(', ') : 'Select roles';
    return <Popup testID={roleString} popupContent={popupContent} alignRight={alignRight}>
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

