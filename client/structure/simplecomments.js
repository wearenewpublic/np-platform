import React from "react";
import { ConversationScreen, HeaderBox, Pad, PadBox, TeaserScreen } from "../component/basics";
import { ActionEdit, ActionReply, ActionReport, ActionUpvote, BasicComments, CommentsInput, CommentsIntro, ComposerScreen } from "../component/comment";
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
        composer: ({about, commentKey}) => <ComposerScreen about={about} commentKey={commentKey} intro={null} contentType='Public Comment' />,
    },
    defaultConfig: {
        commentActions: [ActionReply],
        commentRightActions: [ActionEdit],
        commentTopWidgets: [],
        commentBodyRenderer: null,
        commentBodyStylers: [],
        commentAboveWidgets: [],
        commentAllowEmpty: false,
        commentEditBottomWidgets: [],
        commentEditTopWidgets: [],
        commentPostBlockers: [],
        commentPostCheckers: [],
        commentPostTriggers: [],
        commentInputPlaceholder: 'Share your thoughts...',
        commentReplyPlaceholder: 'Reply to {authorName}...',
        commentInputLoginAction: 'comment',
        commentFilters: [],
        commentRankers: [],

        replyAboveWidgets: [],
        replyFilters: [],
        replyBoosters: [],

        composerSubtitle: () => 'Public Comment',
        composerTopBanners: [],
        composerTopWidgets: [],

        topBanners: [],
        pageBottomWidgets: [],
        pageTopWidgets: [],
        pageShowEmptyHelp: true,
        
        teaserScreen: null,
        noCommentsTitle: 'Start the conversation',
        noCommentsMessage: 'Be the first to share your thoughts',
        noMoreCommentsMessage: 'No more responses',
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
        <HeaderBox>
            <CommentsIntro />
            <Pad />
            <CommentsInput />
        </HeaderBox>
        <BasicComments showInput={false} />
    </ConversationScreen>
}

function CommentTeaserScreen() {
    const {teaserScreen} = useConfig();
    if (teaserScreen) {
        return React.createElement(teaserScreen);
    } else {
        return <TeaserScreen><Banner><UtilityText label='No teaser screen configured' /></Banner></TeaserScreen>
    }
}

