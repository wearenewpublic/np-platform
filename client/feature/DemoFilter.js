import { Toggle } from "../component/button"
import { useDatastore, useSessionData } from "../util/datastore"
import { PadBox } from "../component/basics"
import { UtilityText } from "../component/text"

export const DemoFilterFeature = {
    name: 'Demo Filter',
    key: 'demofilter',
    config: {
        pageTopWidgets: [TypeFilter],
        commentFilters: [filterFunc],
        commentEditTopWidgets: [CatToggle],
        commentTopWidgets: [CatState]
    }
} 

const categories = ['Fact', 'Experience', 'Proposal', 'Opinion']

function TypeFilter({comments}) {
    const datastore = useDatastore();
    const enabled = useSessionData(['demofilter', 'enabled']);
    function setEnabled(value) {
        datastore.setSessionData(['demofilter', 'enabled'], value);
    }
    return <PadBox top={20} horiz={20}><Toggle label='Only Cats' value={enabled} onChange={setEnabled} /></PadBox>
}

function filterFunc({datastore, comment}) {
    const enabled = datastore.getSessionData(['demofilter', 'enabled']); 
    if (enabled) {
        return comment.isCat;
    } else {
        return true;
    }
}

function CatToggle({comment, setComment}) {
    return <PadBox bottom={10} left={16}><Toggle label='Is Cat' value={comment.isCat ?? false} 
        onChange={isCat => setComment({...comment, isCat})} /></PadBox>
}

function CatState({comment}) {
    if (comment.isCat) {
        return <PadBox bottom={10}><UtilityText strong label='Is a cat' /></PadBox>
    }
}
