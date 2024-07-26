import { Heading, Paragraph } from "../component/text";
import { useDerivedCollection } from "../util/datastore";
import { HorizBox, Pad, PadBox } from "../component/basics";
import { ProfilePhoto } from "../component/people";

export const ProfileCommentsFeature = {
    name: 'Profile Comments',
    key: 'profilecomments',
    config: {
        profileWidgets: [ProfileCommentsWidget]
    }
}

function DerivedComment({comment}) {
    return <PadBox top={20}>
        <HorizBox>
            <ProfilePhoto userId={comment.from} type='small' />
            <Pad size={10} />
            <Paragraph text={comment.text} />
        </HorizBox>
    </PadBox>
}

function ProfileCommentsWidget() {
    const comments = useDerivedCollection('comment');

    return <PadBox top={20}>
        <Heading level='1' label='Comments' />
        {comments.map(comment => <DerivedComment key={comment.key} comment={comment} />)}
    </PadBox>    
}

