import React from "react";
import { ConversationScreen, HeaderBox, Pad, TeaserScreen } from "../component/basics";
import { ActionEdit, ActionReply, BasicComments, CommentsInput, CommentsIntro, ComposerScreen } from "../component/comment";
import { Heading, UtilityText } from "../component/text";
import { useConfig } from "../util/features";
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

        headerTopLeftWidgets: [],

        replyAboveWidgets: [],
        replyFilters: [],
        replyBoosters: [],

        composerSubtitle: () => 'Public Comment',
        composerTopBanners: [],
        composerTopWidgets: [],
        composerPreview: CommentsInput,

        topBanners: [],
        pageBottomWidgets: [],
        pageTopWidgets: [],
        pageShowEmptyHelp: true,
        
        teaserScreen: null,
        noCommentsTitle: 'Start the conversation',
        noCommentsMessage: 'Be the first to share your thoughts',
        noMoreCommentsMessage: 'No more responses',
        readOnly: false,

        openLinksInNewTab: false,
    }
}

function HeaderTopWidgets() {
    const {headerTopLeftWidgets} = useConfig();
    if (headerTopLeftWidgets?.length > 0) {
        return <>
            <Pad size={12}/>
            {headerTopLeftWidgets.map((Widget,i) => <Widget key={i}/>)}
            <Pad size={32}/>
        </>
    } else {
        return null;
    }
}

function SimpleCommentsScreen() {
    const {topBanners, composerPreview} = useConfig();
    return <ConversationScreen>
        {topBanners?.map((Banner, i) => <Banner key={i} />)}
        <HeaderBox>
            <HeaderTopWidgets />
            <Heading level={1} label='Comments'/>
            <Pad />
            {React.createElement(composerPreview)}
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

