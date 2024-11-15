import { SubtleButton } from "../component/button";
import { colorBlack, colorTextGrey } from "../component/color";
import { IconUpvote, IconUpvoted } from "../component/icon";
import { useCollection, useDatastore, useObject, usePersonaKey } from "../util/datastore";
import { useIsReadOnly } from "../util/features";

export const UpvoteFeature = {
    name: 'Upvote Comments',
    key: 'upvote',
    config: {
        commentActions: [ActionUpvote]
    }
}


export function ActionUpvote({commentKey}) {
    const personaKey = usePersonaKey();
    const comment = useObject('comment', commentKey);
    const upvotes = useCollection('upvote', {filter: {comment: commentKey}});
    const datastore = useDatastore();
    const readOnly = useIsReadOnly();
    const count = upvotes.length;
    const upvoted = upvotes.some(upvote => upvote.from == personaKey);

    function onUpvote() {
        if (upvoted) {
            const myUpvote = upvotes.find(upvote => upvote.from == personaKey);
            datastore.deleteObject('upvote', myUpvote.key);
        } else {
            datastore.addObject('upvote', {comment: commentKey, from: personaKey});
        }
    }
    
    const disabled = comment?.from == personaKey || readOnly;

    return <SubtleButton icon={upvoted ? IconUpvoted : IconUpvote} bold={upvoted}
        ariaLabel='upvote' testID='upvote'
        color={upvoted ? colorBlack : colorTextGrey}
        disabled={disabled}
        text={count.toString()}
        padRight
        onPress={datastore.needsLogin(onUpvote, 'upvote')} />
}


