import { ActionEdit, ActionReply, ActionReport, Comment, CommentsInput, ComposerScreen } from "../component/comment";
import { ConversationScreen, Narrow } from "../component/basics";
import { DemoSection } from "../component/demo";
import { Datastore } from "../util/datastore";
import { ActionUpvote } from "../feature/UpvoteFeature";
import { StructureDemo } from "../util/instance";


export const CommentDemoFeature = {
    key: 'demo_comment',
    name: 'Comment Demo',
    subscreens: {
        composer: params => <ComposerScreen {...params} contentType='Public Comment' />,
    },
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {label: 'Comment', key: 'comment', screen: CommentScreen},
            ]}
        ],
        structureSections: [
            {label: 'Core Structures', key: 'core', pages: [
                {label: 'Simple Comments', key: 'simplecomments', screen: SimpleCommentsScreen},
            ]},
            {label: 'Config Slots', key: 'slots', pages: [
                {label: 'Comment Config', key: 'commentconfigslots', screen: CommentConfigSlotsScreen}
            ]}
        ],
        featureSections: [
            {label: 'Simple Comments', key: 'simplecomments', pages: [
                {label: 'Upvote', key: 'upvotecomments', screen: UpvoteCommentsScreen},
            ]}
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
            <Datastore collections={collections} config={config} sessionData={sessionData}>
                <DemoSection label='Comment with Standard Actions'>
                    <Comment commentKey={1} />
                    <Comment commentKey={2} />
                    <Comment commentKey={5} />
                </DemoSection>
            </Datastore>
            <DemoSection label='CommentsInput'>
                <CommentsInput />
            </DemoSection>
        </Narrow>
     </ConversationScreen>
}

const comment = [
    {key: 1, from: 'a', text: 'I love this movie!'},
    {key: 2, from: 'b', text: 'I hate it'},
    {key: 3, from: 'c', replyTo: 1, text: 'I can reply'},
    {key: 4, from: 'd', replyTo: 3, text: 'I can reply to the reply'},
]

function SimpleCommentsScreen() {
    return <StructureDemo collections={{comment}} structureKey='simplecomments' />
}

function UpvoteCommentsScreen() {
    return <StructureDemo structureKey='simplecomments'
        collections={{comment}} features={{upvote: true}} />
}


function CommentConfigSlotsScreen() {
    const sessionData = {
        'showReplies/1': true
    }
    return <StructureDemo collections={{comment}} sessionData={sessionData}
        structureKey='simplecomments' features={{config_comment:true}}
    />
}