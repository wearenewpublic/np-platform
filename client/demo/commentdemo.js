import { ActionEdit, ActionReply, ActionReport, BasicComments, Comment, CommentsInput, ComposerScreen } from "../component/comment";
import { ConversationScreen, HeaderBox, Narrow, Pad } from "../component/basics";
import { DemoHeader, DemoSection } from "../component/demo";
import { Datastore, useDatastore } from "../util/datastore";
import { ActionUpvote } from "../feature/UpvoteFeature";


export const CommentDemoFeature = {
    key: 'demo_comment',
    name: 'Comment Demo',
    subscreens: {
        comment: CommentScreen,
        composer: params => <ComposerScreen {...params} contentType='Public Comment' />,
    },
    config: {
        componentSections: [
            {label: 'Comments', pages: [
                {label: 'Comment', key: 'comment'},
            ]}
        ],
        structures: [
            {label: 'Simple Comments', key: 'simplecomments', instanceKey: 'demo'}
        ]
    },
    defaultConfig: {        
        commentAboveWidgets: [],
        replyAboveWidgets: [],
        commentFilters: [],
        replyFilters: [],
        commentAllowEmpty: false,
        commentActions: [ActionReply],
        commentRightActions: [ActionReport, ActionEdit],
        commentEditBottomWidgets: [],
        commentPostBlockers: [],
        commentPostCheckers: [],
        commentInputPlaceholder: 'Share your thoughts...',
        commentReplyPlaceholder: 'Reply to {authorName}...',
        commentInputLoginAction: 'comment',
        noCommentsMessage: 'No responses yet. Start the conversation!',
        noMoreCommentsMessage: 'No more responses'       
    }
}

function DumpDatastore() {
    const datastore = useDatastore();
    const data = datastore.getData();
    console.log('Datastore Data:', data);
}

function CommentScreen() {
    const collections = {
        comment: [
            {key: 1, from: 'a', text: 'I love this movie!'},
            {key: 2, from: 'b', text: 'My comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.'},
            {key: 3, from: 'c', replyTo: 1, text: 'I think this movie is okay.'},
            {key: 4, from: 'd', replyTo: 2, text: 'This reply should be shown'},
            {key: 5, from: 'e', text: 'Comment with no replies'}
        ]
    }
    const config = {
        commentActions: [ActionReply, ActionUpvote],
        commentRightActions: [ActionEdit]
    }
    const sessionData = {
        'showReplies/2': true
    }
    return <ConversationScreen >
        <Narrow>
            <DemoSection label='Comment with Standard Actions'>
                <Datastore collections={collections} config={config} sessionData={sessionData}>
                    <Comment commentKey={1} />
                    <Comment commentKey={2} />
                    <Comment commentKey={5} />
                </Datastore>
            </DemoSection>

            <DemoSection label='CommentsInput'>
                <CommentsInput />
            </DemoSection>
        </Narrow>
     </ConversationScreen>
}


