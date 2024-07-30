import { SubtleButton } from "../component/button";
import { colorBlack, colorDisabledText, colorTextBlue, colorTextGrey } from "../component/color";
import { IconUpvote, IconUpvoted } from "../component/icon";
import { UtilityText } from "../component/text";
import { needsLogin } from "../organizer/Login";
import { useCollection, useDatastore, useObject, usePersonaKey } from "../util/datastore";

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
    
    const disabled = comment?.from == personaKey;

    return <SubtleButton icon={upvoted ? IconUpvoted : IconUpvote} bold={upvoted}
        ariaLabel='upvote'
        color={upvoted ? colorBlack : colorTextGrey}
        disabled={disabled}
        text={count.toString()}
        onPress={needsLogin(onUpvote, 'upvote')} />
}


