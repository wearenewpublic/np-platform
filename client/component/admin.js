import { useContext, useState } from "react";
import { Card, ConversationScreen, Pad, PadBox } from "./basics";
import { Heading, UtilityText } from "./text";
import { InstanceContext } from "../organizer/InstanceContext";
import { CatchList } from "./catcher";
import { CTAButton, IconButton } from "./button";
import { useDatastore, useModulePublicData } from "../util/datastore";
import { goBack } from "../util/navigate";
import { View } from "react-native";
import { useFirebaseUser } from "../util/firebase";
import { getIsLocalhost } from "../platform-specific/url";

export function AdminScreen() {
    const {structure} = useContext(InstanceContext);
    return <ConversationScreen pad>
        <Card>
            <Heading label="Admin Actions" />
            <Pad />
            <CatchList items={structure.adminTools} renderItem={tool => 
                <AdminAction name={tool.name} action={tool.action} />
            } />
        </Card>

    </ConversationScreen>
}

function AdminAction({name, action}) {
    const datastore = useDatastore();
    const [inProgress, setInProgress] = useState(false);
    async function onPress() {
        setInProgress(true);
        await action({datastore});
        goBack();
    }
    return <View>
        <CTAButton type='secondary' disabled={inProgress} label={name} onPress={onPress} />
        {inProgress && <PadBox top={20}><UtilityText label='In Progress...' /></PadBox>}
    </View>
}   

export function useIsAdmin() {
    const fbUser = useFirebaseUser();
    const email = fbUser?.email;
    const adminEmails = useModulePublicData('admin',['adminEmails']);
    const emailDomain = email?.split('@')[1];
    return adminEmails?.includes(email) || (getIsLocalhost() && emailDomain == 'admin.org');
}

