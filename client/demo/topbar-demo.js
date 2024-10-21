import { Pad } from "../component/basics"
import { HelpBubble } from "../component/help"
import { TopBar, TopBarActionProvider } from "../component/topbar"
import { CLICK, POPUP } from "../system/demo"
import { View } from "react-native"

export const TopBarDemoFeature = {
    key: 'demo_topbar',
    name: 'Top Bar Demo',
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {label: 'Top Bar', key:'topbar', storySets: topBarStorySets}
            ]}
        ]
    }
}

function topBarStorySets() {return [
    {
        label: 'Top Bar (Non Admin)', 
        content: <TopBar />,
        stories: [
            {label: 'Show Menu', actions: [
                CLICK('account-menu')
            ]},
            {label: 'Open Profile', actions: [
                CLICK('account-menu'),
                POPUP(CLICK('Profile'))
            ]},
        ]
    },
    {
        label: 'Top Bar (Admin)',
        structureKey: 'simplecomments',
        instanceKey: 'demo',
        content: <TopBar />,
        roles: ['Owner'],
        stories: [
            {label: 'Toggle Config', actions: [
                CLICK('account-menu'),
                POPUP(CLICK('Developer')),
                POPUP(CLICK('Show Config Slots'))
            ]},
        ]
    },
    {
        label: 'Top Bar with Action',
        config: {
            topBarHelpBubbles: [DemoHelpBubble]
        },
        content: <View>
            <TopBar />
            <TopBarActionProvider label='Action' onPress={() => {}} /> 
            <Pad size={40} />
        </View>,
    }
]}

function DemoHelpBubble() {
    return <HelpBubble right condition={true} helpKey='below' text='The top bar can show a help bubble' />
}
