import { useState } from "react"
import { ConversationScreen, HorizBox, Pad, PadBox } from "../component/basics"
import { CTAButton, Popup } from "../component/button"
import { FormField } from "../component/form"
import { Heading, TextField, UtilityText } from "../component/text"
import { useDatastore } from "../util/datastore"
import { View } from "react-native"
import { toBool } from "../util/util"
import { useServerCallResult } from "../util/servercall"
import { colorTextGrey } from "../component/color"
import { useHasCapability } from "../component/admin"
import { Banner } from "../component/banner"

export const UserVerificationFeature = {
    name: 'Verify Users',
    key: 'verifyusers',
    subscreens: {
        verifyUsers: VerifyUsersScreen,
    },
    config: {
        quickLinks: [
            {label: 'Verify Users', screenKey: 'verifyUsers'},
        ]
    },
    capabilities: ['verify-users']
}


export function VerifyUsersScreen() {
    const [refreshKey, setRefreshKey] = useState(0);
    const hasAccess = useHasCapability('verifyusers/verify-users');
    const verifiedUsers = useServerCallResult('verify', 'getVerifiedUsers', {refreshKey});

    if (hasAccess === false) {
        return <Banner><UtilityText label='You do not have access to this feature'/></Banner>
    }

    return <ConversationScreen pad>
        <Pad />
        <Heading level={1} label='Verify Users' />
        <Pad />
        <AddVerifiedUser onUsersAdded={() => setRefreshKey(refreshKey + 1)}/>
        <Pad />
        <Heading level={3} label='Already Verified Users' />
        <VerifiedUserList verifiedUsers={verifiedUsers} />
    </ConversationScreen>
}


function VerifiedUserList({verifiedUsers}) {
    if (!verifiedUsers) {
        return <UtilityText label='Loading verified users...' />
    }
    return <View>{verifiedUsers.map(user => <UtilityText key={user} text={user} />)}</View>
}

function AddVerifiedUser({onUsersAdded}) {
    const [emails, setEmails] = useState('');
    const [inProgress, setInProgress] = useState(false);
    const datastore = useDatastore();

    async function onAdd() {
        setInProgress(true);
        await datastore.callServerAsync('verify', 'addVerifiedUsers', {emails})
        await onUsersAdded();
        setInProgress(false);
        setEmails('');
    }

    return <FormField label='Add new verified users'>
        <TextField testID='new-verified-emails' value={emails} onChange={setEmails} placeholder='Emails of users to add' />
        <Pad />
        {toBool(emails) &&  <HorizBox>
            <Pad />
            <CTAButton size='compact' disabled={inProgress} label='Add Verified Users' onPress={onAdd} />
        </HorizBox>}
        {toBool(inProgress) && <UtilityText label='Adding Verified Users...' />}
    </FormField>
}