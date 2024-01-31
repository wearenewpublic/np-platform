import React from "react";
import { ConversationScreen, Pad, PadBox, TeaserScreen } from "../component/basics";
import { ActionEdit, ActionReply, ActionReport, ActionUpvote, BasicComments, CommentsIntro, ComposerScreen } from "../component/comment";
import { BasicTeaser } from "../component/teaser";
import { UtilityText } from "../component/text";
import { useCollection } from "../util/datastore";
import { useConfig } from "../util/features";
import { expandDataList } from "../util/util";
import { Banner } from "../component/banner";

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
        commentTopWidgets: [],
        commentAboveWidgets: [],
        commentEditBottomWidgets: [],
        commentEditTopWidgets: [],
        commentPostBlockers: [],
        commentInputPlaceholder: 'Share your thoughts...',
        commentReplyPlaceholder: 'Reply to {authorName}...',
        commentInputLoginAction: 'comment',
        commentPostCheckers: [],
        commentFilters: [],
        composerTopBanners: [],
        topBanners: [],
        pageTopWidgets: [],
        teaserScreen: null,
        noCommentsMessage: 'No comments yet. Start the conversation!'
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
    const {topBanners} = useConfig();
    return <ConversationScreen>
        {topBanners?.map((Banner, i) => <Banner key={i} />)}
        <Pad />
        <CommentsIntro />
        <Pad />
        <BasicComments />
    </ConversationScreen>
}

function CommentTeaserScreen() {
    const {teaserScreen} = useConfig();
    if (teaserScreen) {
        return React.createElement(teaserScreen);
    } else {
        return <Banner><UtilityText label='No teaser screen configured' /></Banner>
    }
}

