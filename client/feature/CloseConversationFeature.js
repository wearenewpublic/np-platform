import { View } from "react-native-web";
import { useIsAdmin } from "../component/admin";
import { Banner } from "../component/banner"
import { Pad } from "../component/basics";
import { colorPink } from "../component/color";
import { Heading, UtilityText } from "../component/text";
import { useConfig } from "../util/features";

export const CloseConversationFeature = {
    key: 'readonly',
    name: 'Close Conversation',
    config: {
        composerPreview: ClosedConversationBanner,
        readOnly: true
    },
    defaultConfig: {
        closedTitle: '🚧 Temporarily Closed',
        closedMessage: 'This conversation has been temporarily closed. Please check back soon for it to re-open.',
    }
}

function ClosedConversationBanner() {
    const {closedTitle, closedMessage} = useConfig();
    const isAdmin = useIsAdmin();
    return <View>
        <Banner color={colorPink}>
            <Heading level={2} label={closedTitle} />
            <Pad size={16} />
            <UtilityText label={closedMessage} />            
        </Banner>
        {isAdmin && <Pad size={16} />}
        {isAdmin && <UtilityText type='tiny' label='If you re-open this conversation, you will need to reload it (Admin)' />}
    </View>
}
