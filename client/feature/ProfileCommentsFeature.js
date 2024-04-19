import { Heading, Paragraph, UtilityText } from "../component/text"
import { View } from "react-native";
import { useDerivedCollection } from "../util/datastore";
import { Card, HorizBox, Pad, PadBox, Separator } from "../component/basics";
import { Byline, ProfilePhoto } from "../component/people";

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

