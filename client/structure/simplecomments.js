import { ConversationScreen, Pad, PadBox, TeaserScreen } from "../component/basics";
import { ActionEdit, ActionReply, ActionReport, ActionUpvote, BasicComments, CommentsIntro, ComposerScreen } from "../component/comment";
import { BasicTeaser } from "../component/teaser";
import { useCollection } from "../util/datastore";
import { expandDataList } from "../util/util";

export const SimpleCommentsStructure = {
    key: 'simplecomments',
    name: 'Simple Comments',
    screen: SimpleCommentsScreen,
    teaser: CommentTeaserScreen,
    subscreens: {
        composer: ({about}) => <ComposerScreen about={about} intro={null} contentType='Public Comment' />,
    },
    defaultConfig: {
        commentActions: [ActionReply],
        commentRightActions: [ActionReport, ActionEdit],
        commentEditWidgets: [],
        commentPostBlockers: [],
        commentInputPlaceholder: 'Share your thoughts...',
        commentReplyPlaceholder: 'Reply to {authorName}...',
        commentInputLoginAction: 'comment',
        commentPostCheckers: []
    },
    instance: [
        {
            key: 'test', name: 'Test', comment: expandDataList([
                {from: 'b', text: 'This is another comment'},
                {key: 'a', from: 'a', text: 'This is a comment'},
                {key: 'c', from: 'c', replyTo: 'a', text: 'This is a reply'},
                {from: 'd', replyTo: 'c', text: 'This is a reply to a reply'},
            ]),
        }
    ],
    newInstanceParams: []
}

function SimpleCommentsScreen() {
    return <ConversationScreen>
        <CommentsIntro />
        <Pad />
        <BasicComments />
    </ConversationScreen>
}

function CommentTeaserScreen() {
    const comments = useCollection('comment');    
    return <TeaserScreen>
        <BasicTeaser formatParams={{count: comments.length, singular: 'comment', plural: 'comments'}}/>
    </TeaserScreen>
}

