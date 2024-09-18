import { useIsAdmin } from "../component/admin";
import { Banner } from "../component/banner";
import { ConversationScreen, Pad, PadBox, WrapBox } from "../component/basics"
import { IconButton } from "../component/button";
import { Heading, UtilityText } from "../component/text"
import { useDatastore } from "../util/datastore";
import { useConfig } from "../util/features";
import { gotoInstance } from "../util/navigate";

export const AdminStructure = {
    key: 'admin',
    name: 'Admin Dashboard',
    screen: AdminScreen,
    defaultConfig: {
        quickLinks: [  // TODO: Specify capability required to see each link
            {label: 'Component Demo', structureKey: 'componentdemo'},
            {label: 'Session Log', structureKey: 'eventlog'},
        ],
        panels: [],
    }
}

function AdminScreen() {
    const {quickLinks} = useConfig();
    const isAdmin = useIsAdmin();

    if (!isAdmin) {
        return <Banner><UtilityText label='Only an admin can see this page'/></Banner>
    }

    return <ConversationScreen pad>
        <Pad/>
        <Heading level={1} label='Admin Dashboard' />
        <Pad />
        <Heading level={2} label='Quick Links' />
        <WrapBox>
            {quickLinks.map(quickLink => <PadBox top={8} right={8} key={quickLink.label}>
                <QuickLink quickLink={quickLink} />
            </PadBox>)}
        </WrapBox>
    </ConversationScreen>
}


function QuickLink({quickLink}) {
    const {label, structureKey, screenKey} = quickLink;
    console.log('quickLink', quickLink);
    const datastore = useDatastore();
    function onPress() {
        if (structureKey) {
            datastore.gotoInstance({structureKey, instanceKey: 'one'});
        } else if (screenKey) {
            datastore.pushSubscreen(screenKey);
        }
    }
    return <IconButton label={label} onPress={onPress} />
}
