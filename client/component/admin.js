import { useContext, useState } from "react";
import { Card, ConversationScreen, Pad, PadBox } from "./basics";
import { Heading, UtilityText } from "./text";
import { InstanceContext } from "../organizer/InstanceContext";
import { CatchList } from "./catcher";
import { CTAButton, IconButton } from "./button";
import { useDatastore } from "../util/datastore";
import { goBack } from "../util/navigate";
import { View } from "react-native";

export function AdminScreen() {
    const {structure} = useContext(InstanceContext);
    return <ConversationScreen pad>
        <Card>
            <Heading label="Admin Actions" />
            <Pad />
            <CatchList items={struture.adminTools} renderItem={tool => 
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
