import { TeaserScreen } from "../component/basics";
import { BasicTeaser } from "../component/teaser";
import { useCollection } from "../util/datastore";

export const BasicTeaserFeature = {
    name: 'Basic Teaser',
    key: 'basicteaser',
    config: {
        teaserScreen: BasicTeaserScreen
    }
}

function BasicTeaserScreen() {
    const comments = useCollection('comment');    
    return <TeaserScreen>
        <BasicTeaser formatParams={{count: comments.length, singular: 'comment', plural: 'comments'}}/>
    </TeaserScreen>    
}

