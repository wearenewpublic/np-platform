import { UtilityText } from "../component/text"
import { useConfig } from "../util/features"

export const DemoFeature = {
    name: 'Demo Feature',
    key: 'demo',
    config: {
        widgets: [DemoWidget],
        commentAboveWidgets: [DemoWidget],
        replyAboveWidgets: [DemoWidget],    
        replyFilters: [demoFilter],
        commentFilters: [demoFilter]
    },
    defaultConfig: {
        demoMessage: 'Demo Widget'
    }   
}

export const DemoSecondaryFeature = {
    parentFeature: 'demo',
    name: 'Demo Secondary Feature',
    key: 'demo_secondary',
    config: {
        demoMessage: 'Modified Message'
    },
}


function DemoWidget() {
    const {demoMessage} = useConfig();
    return <UtilityText label={demoMessage} />
}

function demoFilter({comment}) {
    console.log('demoFilter', comment, comment.text, comment.text.includes('cat'));
    return !comment?.text.includes('cat');
}


