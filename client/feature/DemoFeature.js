import { Banner } from "../component/banner";
import { Center, PadBox } from "../component/basics";
import { CTAButton, SubtleButton, Tag } from "../component/button";
import { colorBannerGreen } from "../component/color";
import { Heading, Paragraph, UtilityText } from "../component/text"
import { useConfig } from "../util/features"
import { Star } from '@carbon/icons-react';

export const DemoFeature = {
    name: 'Demo Feature',
    key: 'demo',
    config: {
        commentActions: [CommentAction],
        commentRightActions: [CommentRightAction],
        commentTopWidgets: [CommentTopWidget],
        commentAboveWidgets: [CommentAboveWidget],
        commentAllowEmpty: true,
        commentEditBottomWidgets: [CommentEditBottomWidget],
        commentEditTopWidgets: [CommentEditTopWidget],
        commentPostBlockers: [commentPostBlocker],
        commentPostCheckers: [commentPostCheckerAsync],
        commentPostTriggers: [commentPostTriggerAsync],
        commentFilters: [commentFilter],
        commentRankers: [{label: 'Boost Godzilla', ranker: commentRanker}],

        replyAboveWidgets: [ReplyAboveWidget],    
        replyFilters: [replyFilter],
        replyBoosters: [replyBooster],

        composerSubtitle: () => 'Composer Subtitle',
        composerTopBanners: [ComposerTopBanner],

        topBanners: [TopBanner],
        pageTopWidgets: [PageTopWidget],

        noCommentsTitle: 'No Comments Title',
        noCommentsMessage: 'No Comments Message',
        noMoreCommentsMessage: 'No More Comments Message',
    },
    defaultConfig: {
        demoAboveMessage: 'Comment Above Widget',
    }   
}

export const DemoSecondaryFeature = {
    parentFeature: 'demo',
    name: 'Demo Secondary Feature',
    key: 'demo_secondary',
    config: {
        demoAboveMessage: 'Modified Message'
    },
}

function CommentAction() {
    return <SubtleButton icon={Star} onPress={()=>alert('onPress')} padRight label='Comment Action' />
}

function CommentRightAction() {
    return <SubtleButton icon={Star} onPress={()=>alert('onPress')} padLeft label='Comment Right Action' />
}

function CommentAboveWidget() {
    const {demoAboveMessage} = useConfig();
    return <PadBox bottom={10}><Tag label={demoAboveMessage} /></PadBox>
}

function ReplyAboveWidget() {
    return <PadBox bottom={10}><Tag label='Reply Above Widget' /></PadBox>
}

function CommentTopWidget() {
    return <PadBox bottom={10}><Tag label='Comment Top Widget' /></PadBox>
}

function commentPostBlocker({comment}) {
    return comment.text.includes('cat');
}

async function commentPostCheckerAsync({datastore, comment}) {
    if (comment.text.includes('dog')) {
        return {allow: false, commentProps: {blockHappened: 'dog'}}
    } else {
        return {allow: true, commentProps: {blockHappened: null}}
    }
}

async function commentPostTriggerAsync({datastore, comment, commentKey}) {
    console.log('commentPostTriggerAsync', comment, commentKey);
}

function CommentEditBottomWidget({comment, setComment}) {
    function onPress() {
        setComment({...comment, text: comment.text + ' and I love cats'});
    }
    return <PadBox bottom={16}><CTAButton onPress={onPress} label='Comment Edit Bottom Widget' /></PadBox>
}

function CommentEditTopWidget({comment, setComment}) {    
    function onPress() {
        setComment({...comment, text: comment.text + ' and I love dogs'});
    }
    return <PadBox bottom={16}>
        <CTAButton onPress={onPress} label='Comment Edit Top Widget' />
        <UtilityText label='Comments that mention cats will disable the post button' />
        <UtilityText label='Comments that mention dogs will be rejected on post' />
        {comment.blockHappened && <Tag label='You mentioned a dog' />}
    </PadBox>
}

function commentFilter({comment}) {
    return !comment?.text.includes('cat');
}

function replyFilter({comment}) {
    return !comment?.text.includes('dog');
}

function replyBooster({comments}) { 
    return comments.filter(comment => comment.text.includes('godzilla'))[0];   
}

function commentRanker({datastore, comments}) {
    console.log('commentRanker', comments);
    const newestFirst = comments.sort((a, b) => b.time - a.time);
    const topComments = newestFirst.filter(comment => comment.text.toLowerCase().includes('godzilla'));
    const bottomComments = newestFirst.filter(comment => !comment.text.toLowerCase().includes('godzilla'));
    return topComments.concat(bottomComments);
}

function ComposerTopBanner() {
    return <Banner color={colorBannerGreen}>
        <UtilityText label='Composer Top Banner' />
    </Banner>
}

function TopBanner() {
    return <PadBox bottom={20}>
        <Banner color={colorBannerGreen}>
            <Heading label='Top Banner' />
            <Paragraph text='Demo Feature is enabled. This shows how to use all of the config slots' />
            <UtilityText text='Replies containing "godzilla" will be boosted and ranked top' />
            <UtilityText text='Comments containing "cat" will be filtered' />
            <UtilityText text='Replies containing "dog" will be filtered' />
        </Banner>
    </PadBox>
}

function PageTopWidget() {
    return <PadBox bottom={10} top={20}><Center><Tag label='Page Top Widget' /></Center></PadBox>
}