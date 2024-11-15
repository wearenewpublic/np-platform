import { Banner } from "../component/banner";
import { Center, Pad, PadBox, ShadowBox } from "../component/basics";
import { CTAButton, SubtleButton, Tag } from "../component/button";
import { colorBannerGreen, colorBlueBackground, colorPinkBackground, colorWhite } from "../component/color";
import { CommentBody } from "../component/comment";
import { DemoPageWidget, DemoWidget } from "../system/demo";
import { Heading, Paragraph, UtilityText } from "../component/text"
import { FIRST, useConfig } from "../util/features"
import { Star } from '@carbon/icons-react';
import { useInstanceParams, useScreenParams } from "../util/params";
import { Modal } from "../component/modal";
import { useGlobalProperty } from "../util/datastore";

export const DemoFeature = {
    name: 'Show Config Slots',
    key: 'config_comment',
    config: {
        commentActions: [CommentAction],
        commentRightActions: [CommentRightAction],
        commentTopWidgets: [() => <DemoWidget text='Comment Top Widget' />],
        commentAboveWidgets: [() => <DemoWidget text='Comment Above Widget' />],
        commentAllowEmpty: true,
        // commentBodyRenderer: CommentBodyRenderer,
        commentBodyStylers: [commentBodyStylerHate, commentBodyStylerReply],
        commentStylers: [commentStylerLove],
        commentEditBottomWidgets: [CommentEditBottomWidget],
        commentEditTopWidgets: [CommentEditTopWidget],
        commentPostBlockers: [commentPostBlocker],
        commentPostCheckers: [commentPostCheckerAsync],
        commentPostTriggers: [commentPostTriggerAsync],
        commentFilters: [commentFilter],
        commentRankers: [{label: 'Boost Godzilla', ranker: commentRanker}],

        replyAboveWidgets: [() => <DemoWidget text='Reply Above Widget' />],    
        replyFilters: [replyFilter],
        replyBoosters: [replyBooster],

        composerSubtitle: () => 'Composer Subtitle',
        composerTopBanners: [ComposerTopBanner],
        composerTopWidgets: [ComposerTopWidget],

        topBanners: [TopBanner],
        pageBottomWidgets: [PageBottomWidget],
        pageTopWidgets: [PageTopWidget],

        noCommentsTitle: 'No Comments Title',
        noCommentsMessage: 'No Comments Message',
        noMoreCommentsMessage: 'No More Comments Message',
    },
    defaultConfig: {
        demoMessage: 'Placeholder Message',
    }   
}

export const DemoSecondaryFeature = {
    parentFeature: 'config_comment',
    name: 'Demo Secondary Feature',
    key: 'demo_secondary',
    config: {
        demoMessage: 'Message from Secondary Feature',
        commentTopWidgets: FIRST([() => <DemoWidget text='FIRST Widget' />])
    },
}

function onPress() {
    alert('onPress');
}

function CommentAction() {
    return <SubtleButton icon={Star} onPress={onPress} padRight label='Comment Action' />
}

function CommentRightAction() {
    return <SubtleButton icon={Star} onPress={onPress} padLeft label='Comment Right Action' />
}

function commentPostBlocker({datastore, comment}) {
    return comment.text.includes('cat');
}

async function commentPostCheckerAsync({datastore, comment}) {
    if (comment.text.includes('dog')) {
        return {allow: false, commentProps: {
            blockHappened: 'dog'
        }}
    } else {
        return {
            allow: true, 
            commentProps: {blockHappened: null}, 
            modal: ({onClose}) => <CommentPostModal onClose={onClose} label='You did not mention a dog. Thank you.' />
        }
    }
}

function CommentPostModal({label, onClose}) {
    return <Modal onClose={onClose} buttonRow={<CTAButton wide label='I understand' onPress={onClose}/>}>
        <PadBox horiz={20} vert={20}><UtilityText label={label} /></PadBox>
    </Modal>
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
    </PadBox>
}

function ComposerTopWidget({comment, setComment}) {
    function onPress() {
        setComment({...comment, text: comment.text + ' and I love komodo dragons'});
    }

    return <PadBox vert={20}><ShadowBox>
        <PadBox horiz={20} vert={20}>
            <Heading label='Composer Top Widget' />
            <UtilityText label='Comments that mention cats will disable the post button' />
            <UtilityText label='Comments that mention dogs will be rejected on post' />
            {comment.blockHappened && <Tag label='You mentioned a dog' />}
            <Pad />
            <CTAButton onPress={onPress} label='Add Komodo Dragon' />
        </PadBox>
    </ShadowBox></PadBox>
}

function commentStylerLove({comment}) {
    if (comment.text.includes('love')) {
        return {
            boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.10)',
            margin: 16, 
            borderRadius: 12
        };
    } else {return null}
}
function commentBodyStylerHate({comment}) {
    if (comment.text.includes('hate')) {
        return {backgroundColor: colorPinkBackground, padding: 16, borderRadius: 8};
    } else {return null}
}
function commentBodyStylerReply({comment}) {
    if (comment.replyTo) {
        return {backgroundColor: colorBlueBackground, padding: 16, borderRadius: 8};
    } else {return null}
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
    const newestFirst = comments.sort((a, b) => b.time - a.time);
    const topComments = newestFirst.filter(comment => comment.text.toLowerCase().includes('godzilla'));
    const bottomComments = newestFirst.filter(comment => !comment.text.toLowerCase().includes('godzilla'));
    return topComments.concat(bottomComments);
}

function ComposerTopBanner() {
    const {bestCat} = useInstanceParams();

    return <Banner color={colorBannerGreen}>
        <UtilityText label='Composer Top Banner' />
        <UtilityText text={`bestCat instance param is : ${bestCat}`} />
    </Banner>
}

function TopBanner() {
    const {bestCat} = useScreenParams();
    const {demoMessage} = useConfig();
    return <PadBox bottom={20}>
        <Banner color={colorBannerGreen}>
            <Heading label='Top Banner' />
            <Paragraph text='Demo Feature is enabled. This shows how to use all of the config slots' />
            <UtilityText text='Replies containing "godzilla" will be boosted and ranked top' />
            <UtilityText text='Comments containing "cat" will be filtered' />
            <UtilityText text='Replies containing "dog" will be filtered' />
        </Banner>
        <Pad size={8} />
        <Banner>
            <UtilityText text={`bestCat screen param is : ${bestCat}`} />
            {demoMessage && <UtilityText text={demoMessage} />}
        </Banner>        
    </PadBox>
}

function PageTopWidget() {
    return <DemoPageWidget text='Page Top Widget' />
}

function PageBottomWidget() {
    return <DemoPageWidget text='Page Bottom Widget' />
}
