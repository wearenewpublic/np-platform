import { DemoPageWidget } from "../component/demo"

export const DemoProfileFeature = {
    name: 'Show Config Slots',
    key: 'config_profile',
    config: {
        profileWidgets: [ProfileWidget]
    }   
}

function ProfileWidget() {
    return <DemoPageWidget text='Profile Widget' />
}


