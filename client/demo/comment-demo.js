import { ActionEdit, ActionReply, ActionReport, BasicComments, Comment, CommentsInput, Composer, ComposerScreen } from "../component/comment";
import { ConversationScreen, Narrow, Pad, Separator } from "../component/basics";
import { CLICK, DemoSection, INPUT, POPUP } from "../system/demo";
import { Datastore } from "../util/datastore";
import { ActionUpvote } from "../feature/UpvoteFeature";
import { StructureDemo } from "../util/instance";
import { View } from "react-native-web";


export const CommentDemoFeature = {
    key: 'demo_comment',
    name: 'Comment Demo',
    subscreens: {
        composer: params => <ComposerScreen {...params} contentType='Public Comment' />,
    },
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {
                    label: 'Comment', key: 'comment', storySets: commentStorySets,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1104-13687&t=MC9nppcf9h2iJDKP-1'
                },
            ]}
        ],
        structureSections: [
            {label: 'Core Structures', key: 'core', pages: [
                {label: 'Simple Comments', key: 'simplecomments', screen: SimpleCommentsScreen},
            ]},
            {label: 'Config Slots', key: 'slots', pages: [
                {label: 'Comment Config', key: 'commentconfigslots', screen: CommentConfigSlotsScreen},
                {label: 'Composer Config', key: 'composerconfigslots', screen: ComposerConfigSlotsScreen}

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
        commentInputLoginAction: '',
        noCommentsMessage: 'No responses yet. Start the conversation!',
        noMoreCommentsMessage: 'No more responses'       
    }
}

const collections = {
    comment: [
        {key: 1, from: 'a', text: 'I love this movie!'},
        {key: 2, from: 'b', text: 'My comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.\nMy comment is very long.'},
        {key: 3, from: 'c', replyTo: 1, text: 'I think this movie is okay.'},
        {key: 4, from: 'a', replyTo: 2, text: 'This reply should be shown'},
        {key: 5, from: 'e', text: 'Comment with no replies'}
    ]
}

const config = {
    commentActions: [ActionReply, ActionUpvote],
    commentRightActions: [ActionEdit]
}

function commentStorySets() {return [
    {
        label: 'Comment Actions',
        collections, config, sessionData: {'showReplies/2': true},
        content: <Comment commentKey={2} />,
        pad: false,
        stories: [
            {label: 'Edit Reply', actions: 
                [CLICK('Edit'), INPUT('comment-edit', 'Edited Comment'), CLICK('Update')]
            },
            {label: 'Cancel Editing Reply', actions: 
                [CLICK('Edit'), CLICK('Cancel')]
            },
            {label: 'Delete Reply', actions:
                [CLICK('Edit'), CLICK('delete'), POPUP(CLICK('confirm-delete'))]
            },
            {label: 'Hide Replies', actions:
                [CLICK('toggle-replies')]
            },
            {label: 'Read More', actions:
                [CLICK('Read more')]
            },
            {label: 'Go to Profile', actions: 
                [CLICK('Bob Bauer')]
            }
        ]
    },
    {
        label: 'Logged out Comment',
        collections, config, personaKey: null,
        content: <Comment commentKey={5} />,
        stories: [
            {label: 'Login to Reply', actions: 
                [CLICK('Reply')]
            },
            {label: 'Login to Upvote', actions: 
                [CLICK('upvote')]
            }

        ]
    },
    {
        label: 'Composer and Comments',
        config: {
            noMoreCommentsMessage: 'No more comments',
            commentInputPlaceholder: 'Gimme a comment'
        },
        content: <View>
                <BasicComments />
                <Composer goBackAfterPost />
            </View>,
        stories: [
            {label: 'Write comment', actions: [
                INPUT('comment-edit', 'This is my comment'),
                CLICK('Post')
            ]}
        ]
    }
]}

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
        'showReplies/1': true,
        'replyToComment/1': true
    }
    return <StructureDemo collections={{comment}} sessionData={sessionData}
        structureKey='simplecomments' features={{config_comment:true, demo_secondary: true}}
        params={{bestCat: 'Mog'}}
    />
}

function ComposerConfigSlotsScreen() {
    const sessionData = {
        'showReplies/1': true
    }
    return <StructureDemo collections={{comment}} sessionData={sessionData}
        structureKey='simplecomments' screenKey='composer' 
        features={{config_comment:true, demo_secondary: true}}
        params={{bestCat: 'Mog'}}
    />
}