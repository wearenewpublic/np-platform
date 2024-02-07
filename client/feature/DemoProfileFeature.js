import { UtilityText } from "../component/text"

export const DemoProfileFeature = {
    name: 'Demo Profile Feature',
    key: 'profiledemo',
    config: {
        profileWidgets: [DemoWidget]
    }   
}

function DemoWidget() {
    return <UtilityText label='Demo Profile Widget' />
}


