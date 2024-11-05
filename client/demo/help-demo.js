import { View } from "react-native-web"
import { HelpBubble } from "../component/help"
import { UtilityText } from "../component/text"
import { HorizBox, Pad } from "../component/basics"
import { CLICK } from "../system/demo"

export const HelpDemoFeature = {
    name: 'Help Demo',
    key: 'demo_help',
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {
                    label: 'Help', key: 'help', storySets: helpStorySets,
                    designUrl: 'https://www.figma.com/design/qbH103GBR3McZqhUp7O9fA/Onboarding-%26-Login-%26-Community-Guidelines---Testing?node-id=446-13588&node-type=frame&t=WoTasw1N3LUhU58o-0'
                },
            ]}
        ]
    }
}

function helpStorySets() {return [
    {
        label: 'Help Bubble',
        content: <View>
            <UtilityText text='Help Below Left' />
            <HelpBubble pointer condition={true} helpKey='below' text='This is a help bubble shown below and to the left' />
            <Pad size={180} />
            <HelpBubble above right condition={true} helpKey='above' 
                titleText='Help Title'
                text='This is a help bubble shown above and to the right' />
            <HorizBox spread>
                <Pad />
                <UtilityText text='Help Above Right' />
            </HorizBox>
            <UtilityText text='Help Wide' />
            <HelpBubble wide condition={true} helpKey='wide' text='This is a help bubble shown wide' />
            <Pad />
        </View>,
        stories: [
            {label: 'Close Below', actions: [
                CLICK('close-below')
            ]},
            {label: 'Close Above', actions: [
                CLICK('close-above')
            ]},

        ]    
    },
]}
