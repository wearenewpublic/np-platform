import { BasicComments, Composer } from "../component/comment"
import { ClosedConversationBanner, CloseConversationFeature } from "../feature/CloseConversationFeature"
import { LengthLimitFeature } from "../feature/LengthLimitFeature"
import { CLICK, INPUT } from "../system/demo"

export const BasicFeaturesDemoFeature = {
    key: 'demo_basicfeatures',
    name: 'Basic Features Demo',
    config: {
        componentSections: [
            {label: 'Conversation Features', key: 'coversation', pages: [
                {
                    label: 'Close Conversation',
                    key: 'closeconversation',
                    storySets: closeConversationStorySets
                },
                {
                    label: 'Length Limit',
                    key: 'lengthlimit',
                    storySets: lengthLimitStorySets
                },
                {
                    label: 'Reply Notifications',
                    key: 'replynotifs',
                    storySets: replyNotifsStorySets
                }
            ]}
        ]
    }
}

function closeConversationStorySets() {return [
    {
        label: 'Closed Conversation Banner',
        content: <ClosedConversationBanner />,
        config: CloseConversationFeature.defaultConfig,
    }     
]}

function lengthLimitStorySets() {return [
    {
        label: 'Length Limit',
        config: LengthLimitFeature.config,
        content: <Composer />,
        stories: [
            {label: 'Comment too short', actions: [
                INPUT('comment-edit', 'Too short')
            ]},
            {label: 'Comment too long', actions: [
                INPUT('comment-edit', 'a'.repeat(1001))
            ]},
            {label: 'Comment just right', actions: [
                INPUT('comment-edit', 'This comment is a good length for a comment. It says enough to have some real substance and not just be a throwaway comment, but not so long as to be a burden to read. It is a comment that is just right.')
            ]},
        ]
    }
]}

const collections = {comment: [
    {key: 1, from: 'b', text: 'This is a comment'},
]}

const serverCall = {
    notifs: {sendNotifsForReply: () => {}}
}

function replyNotifsStorySets() {return [
    {
        label: 'Reply Notifications',
        collections, serverCall,
        structureKey: 'simplecomments',
        features: ['replynotifications'],
        content: <BasicComments />,
        stories: [
            {label: 'Reply to comment', actions: [
                CLICK('Reply'),
                INPUT('comment-edit', 'Replying to the comment'),
                CLICK('Post')
            ]}
        ]
    }
]}
