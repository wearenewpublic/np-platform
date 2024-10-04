import { TopBar } from "../component/topbar"
import { CLICK, POPUP } from "../system/demo"

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
           {label: 'Open Admin', actions: [
                CLICK('account-menu'),
                POPUP(CLICK('Admin'))
            ]}
        ]
    }
]}
