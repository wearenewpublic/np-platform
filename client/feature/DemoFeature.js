import { UtilityText } from "../component/text"

export const DemoFeature = {
    name: 'Demo Feature',
    key: 'demo',
    config: {
        widgets: [DemoWidget],
        commentAboveWidgets: [DemoWidget],
        replyAboveWidgets: [DemoWidget],    
        replyFilters: [demoFilter],
        commentFilters: [demoFilter]
    }   
}

function DemoWidget() {
    return <UtilityText label='Demo Widget' />
}

function demoFilter({comment}) {
    console.log('demoFilter', comment, comment.text, comment.text.includes('cat'));
    return !comment?.text.includes('cat');
}


