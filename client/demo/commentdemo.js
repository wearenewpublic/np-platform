import { ActionEdit, ActionReply, ActionReport, BasicComments, CommentsInput, ComposerScreen } from "../component/comment";
import { ConversationScreen, HeaderBox, Narrow, Pad } from "../component/basics";
import { DemoHeader } from "../component/demo";


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
        noMoreCommentsMessage: 'No more comments'       
    }
}

function CommentScreen() {
    return <ConversationScreen >
        <Narrow pad={false}>
            <HeaderBox horiz={20} vert={20}>
                <DemoHeader label='Comments' />
                <Pad/>
                <CommentsInput />
            </HeaderBox>
            <BasicComments intro={null} />
        </Narrow>
     </ConversationScreen>
}


