import { UtilityText } from "../component/text"

export const DemoFeature = {
    name: 'Demo Feature',
    key: 'demo',
    config: {
        widgets: [DemoWidget]
    }   
}

function DemoWidget() {
    return <UtilityText label='Demo Widget' />
}


