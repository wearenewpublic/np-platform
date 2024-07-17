import { StyleSheet, Switch, Text, TextBase, View } from "react-native";
import { Byline, FacePile, Persona, ProfilePhoto } from "../component/people";
import { usePersonaKey } from "../util/datastore";
import { IconAudio, IconChevronDown, IconCircleCheck, IconClose, IconCloseBig, IconComment, IconCommentBig, IconEdit, IconEmoji, IconImage, IconInfo, IconLeftArrow, IconLeftArrowBig, IconList, IconReply, IconReport, IconSave, IconUpvote, IconUpvoted, IconVideo } from "../component/icon";
import { CharacterCounter, ContentHeading, ContentParagraph, DataVizText, EditorialHeading, Heading, LinkText, Paragraph, TextField, TextFieldButton, UtilityText } from "../component/text";
import { colorBlack, colorBlueBackground, colorPink, colorRed, colorTextBlue, colorTextGrey } from "../component/color";
import { BannerIconButton, BreadCrumb, CTAButton, DropDownSelector, ExpandButton, IconButton, ModalButton, PhotoPile, ReactionButton, SubtleButton, Tag, TextButton, Toggle } from "../component/button";
import { useState } from "react";
import { expandDataList } from "../util/util";
import { ActionEdit, ActionReply, ActionReport, BasicComments, Comment, CommentsInput, CommentsIntro, ComposerScreen } from "../component/comment";
import { gotoInstance, pushSubscreen } from "../util/navigate";
import { RichText, wrapLinks } from "../component/richtext";
import { ConversationScreen, HeaderBox, HorizBox, Narrow, Pad, PadBox, Separator, TeaserScreen } from "../component/basics";
import { BasicTeaser } from "../component/teaser";
import { useConfig } from "../util/features";
import { Banner, ClickableBanner, TopBanner } from "../component/banner";
import { TrashCan, Pin } from "@carbon/icons-react"
import { Modal } from "../component/modal";


export const ComponentDemoStructure = {
    key: 'componentdemo',
    name: 'Component Demo',
    screen: ComponentDemoScreen,
    subscreens: {
        text: TextScreen,
        profile: ProfileScreen,
        button: ButtonScreen,
        comment: CommentScreen,
        teaserDemo: TeaserDemoScreen,
        banner: BannerDemoScreen,
        modal: ModalScreen,
        composer: params => <ComposerScreen {...params} contentType='Public Comment' />,
    },
    defaultConfig: {
        widgets: [DefaultWidget],
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

function DefaultWidget() {
    return <UtilityText label='Default Widget'/>
}

function TextScreen() {
    const [text, setText] = useState(null);

    return <ConversationScreen>
        <Narrow>
            <DemoSection label='UI Text'>
                <Heading label='Heading 1' level={1} />
                <Heading label='Heading 2' level={2} />
                <Paragraph type='large' label='Paragraph large' />
                <Paragraph type='small' strong label='Paragraph small strong' />
                <Paragraph type='small' label='Paragraph small' />
                <UtilityText type='large' label='Utility large' />
                <UtilityText label='Utility small caps' caps strong />
                <UtilityText strong label='Utility small strong' />
                <UtilityText label='Utility small' />

                <UtilityText color={colorTextGrey} label='Utility small color:TextGrey' />
                <UtilityText underline label='Utility small Underline' />
                
                <UtilityText type='tiny' label='Utility tiny' />
                <UtilityText type='tiny' strong label='Utility tiny strong' />
                <UtilityText type='tiny' caps label='Utility tiny Caps' />
            </DemoSection>
            <DemoSection label='Brand Text'>
                <EditorialHeading level={1} label='Editorial Heading 1' />
                <EditorialHeading level={2} label='Editorial Heading 2' />
                <EditorialHeading level={3} label='Editorial Heading 3' />
                <EditorialHeading level={3} italic label='Editorial Heading 3 Italic' />
                <EditorialHeading level={4} label='Editorial Heading 4' />
                <EditorialHeading level={4} italic label='Editorial Heading 4 Italic' />
                <EditorialHeading level={5} label='Editorial Heading 5' />
                <EditorialHeading level={5} italic label='Editorial Heading 5 Italic' />
            </DemoSection>
            <DemoSection label='DataViz Text'>
                <DataVizText type='heading1' label='Data Viz Heading 1' />
                <DataVizText type='heading2' label='Data Viz Heading 2' />
                <DataVizText type='number' label='Data Viz Number' />
                <DataVizText type='label' label='Data Viz Label' />
                <DataVizText type='labelStrong' label='Data Viz Label Strong' />

            </DemoSection>
            <DemoSection label='Text Field'>
                <TextField value={text} placeholder='Enter some text' onChange={setText} />
                <TextFieldButton placeholder='I am actually a button' onPress={() => {}} />
            </DemoSection>
            <DemoSection label='Character Counter'>
                <CharacterCounter min={10} max={100} text='Me too' />
                <CharacterCounter min={10} max={80} text='0123456789012345678901234567890012345678901234567890123456789001234567890123456789012345678900123456789012345678901234567890' />
                <CharacterCounter min={10} max={20} text='012345678901234567' />
                <Pad size={8}/>
                <TextField value={text} placeholder='Enter some text' onChange={setText} />
                <CharacterCounter min={10} max={80} text={text} />

            </DemoSection>
        </Narrow>
    </ConversationScreen>
}

function ProfileScreen() {
    const personaKey = usePersonaKey();
    const p = personaKey;
    return <ConversationScreen >
        <Narrow>
            <DemoSection label='Profile Photo'>
                <SpacedArray horiz pad={8}>
                    <ProfilePhoto userId={personaKey} />
                    <ProfilePhoto userId={personaKey} type="small"/>
                    <ProfilePhoto userId={personaKey} type="tiny"/>
                    <ProfilePhoto userId={personaKey} check={true} />
                    <ProfilePhoto userId={personaKey} type="small" check/>
                    <ProfilePhoto userId={personaKey} type="tiny" check/>
                </SpacedArray>
            </DemoSection>
            <DemoSection label='Facepile'>
                <FacePile userIdList={[p,p,p]} type='small' />
                <FacePile userIdList={[p,p,p,p,p,p,p]} type='tiny' />
            </DemoSection>
            <DemoSection label='Byline'>
                <Byline userId={personaKey} type='large' time={Date.now()} />
                <Byline userId={personaKey} type='large' time={Date.now() - 1000 * 60 * 10} edited={Date.now()} />
                <Byline userId={personaKey} type='small' time={Date.now()} />
                <Byline userId={personaKey} type='small' />
                <Byline userId={personaKey} type='small' time={Date.now()} />
                <Byline userId={personaKey} type='small' photoType='large' />
                <Byline userId={personaKey} type='small' photoType='large' time={Date.now()} />
            </DemoSection>
            <DemoSection label='Anonymous'>
                <Byline name='Anonymous User' type='large' time={Date.now()} />
                <Byline name='Anonymous User' type='large' time={Date.now() - 1000 * 60 * 10} edited={Date.now()} />
                <Byline name='Anonymous User' type='small' time={Date.now()} />
                <Byline name='Anonymous User' type='small' />
                <Byline name='Anonymous User' photoType='large' type='small' time={Date.now()} />
                <Byline name='Anonymous User' photoType='large' type='small' />
            </DemoSection>
        </Narrow>
     </ConversationScreen>
}

function ButtonScreen() {
    const [switchValue, setSwitchValue] = useState(false);
    const [dropDownValue, setDropDownValue] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const inputString = 'Check this link [OpenAI](https://www.openai.com) or visit https://www.example.com directly.';

    return <ConversationScreen >
        <Narrow>

            <DemoSection label='CTA Button'>
                <SpacedArray horiz>
                    <CTAButton label='Primary Button' type='primary' />
                    <CTAButton label='Secondary Button' type='secondary' />
                    <CTAButton label='Accent Button' type='accent' />
                </SpacedArray>
                <SpacedArray horiz>
                    <CTAButton icon={<TrashCan style={{fill: colorRed}} />} label='Delete Button' type='delete' />
                    <CTAButton label='✨ Accent with Emoji' type='accent' />
                    <CTAButton label='Disabled Button' type='primary' disabled />
                </SpacedArray>
                <CTAButton wide label='Wide Button' />
            </DemoSection>
            <DemoSection label='Action Button'>
                <SpacedArray horiz>
                    <IconButton icon={IconReply} label='Respond' />
                    <IconButton icon={IconComment} label='Respond' />
                    <IconButton icon={IconEdit} label='Edit' />
                    <IconButton icon={IconSave} label='Save' />
                </SpacedArray>
                <SpacedArray horiz>
                    <IconButton icon={IconImage} label='Image' />
                    <IconButton icon={IconAudio} label='Audio' />
                    <IconButton icon={IconVideo} label='Video' />
                    <IconButton icon={IconEmoji} label='Emoji' />
                </SpacedArray>
                <IconButton wide icon={IconComment} label='Wide Button' />
            </DemoSection>
            <DemoSection label='Subtle Button'>
                <SpacedArray horiz>
                    <SubtleButton icon={IconReply} label='Reply' />                    
                    <SubtleButton icon={IconUpvote} label='Upvote ({count})' formatParams={{count: 22}} />
                    <SubtleButton icon={IconUpvoted} label='Upvoted ({count})' formatParams={{count: 23}} color={colorBlack} />
                    <SubtleButton icon={IconReport} label='Report' />
                    <SubtleButton icon={IconComment} label='{count} {noun}' 
                        formatParams={{singular: 'comment', plural: 'comments', count: 12}} />
                    <SubtleButton icon={Pin} label='Community Guidelines' />
                </SpacedArray>
            </DemoSection>
            <DemoSection label='Text Button'>
                <SpacedArray horiz>
                    <TextButton leftIcon={IconClose} label='Close' />
                    <TextButton label='Show more comments' rightIcon={IconChevronDown} color={colorTextBlue} />
                    <TextButton label='Cancel' underline color={colorTextGrey} />
                    <TextButton type='small' text={'This is a question'} strong />
                    <TextButton type='small' paragraph text={'This is a paragraph question'} strong />
                </SpacedArray>
                <SpacedArray>
                    <TextButton label='Editoral 1 Italic' editorial italic/>
                    <TextButton label='Editoral 2 Italic' editorial level={2} italic/>
                </SpacedArray>
            </DemoSection>
            <DemoSection label='Expand Button'>
                <ExpandButton userList={['a','b','c','d']} label='{count} {noun}' 
                    formatParams={{count: 22, singular: 'reply', plural: 'replies'}} expanded={expanded} setExpanded={setExpanded} />
                <ExpandButton photoUrlList={['https://picsum.photos/100/100', 'https://picsum.photos/100/100', 'https://picsum.photos/100/100']} 
                    label='{count} related {noun}' 
                    formatParams={{count: 22, singular: 'article', plural: 'articles'}} expanded={expanded} setExpanded={setExpanded} />

            </DemoSection>
            <DemoSection label='Photo Pile'>
                <PhotoPile photoUrlList={['https://picsum.photos/100/100']} />
                <PhotoPile photoUrlList={['https://picsum.photos/100/100', 'https://picsum.photos/100/100']} />
                <PhotoPile photoUrlList={['https://picsum.photos/100/100', 'https://picsum.photos/100/100', 'https://picsum.photos/100/100']} />
            </DemoSection>
            <DemoSection label='Tag'>
                <Tag label='Subtle Tag' type='subtle' />
                <Tag label='🔥 Emphasized Tag' type='emphasized' color={colorPink} />
                <Tag label='Tiny Tag' type='tiny' />
            </DemoSection>
            <DemoSection label='Reaction Button'>
                <ReactionButton emoji='🤝🏽' label='Respect' count={0} />
                <ReactionButton emoji='🤝🏽' label='Respect' count={1} />
                <ReactionButton emoji='🤝🏽' label='Selected' count={1} selected />                
                <ReactionButton emoji='🤝🏽' label='View only' count={2} viewOnly />
            </DemoSection>
            <DemoSection label='DropDownSelector'>
                <DropDownSelector label='Sort by' 
                    value={dropDownValue} onChange={setDropDownValue}
                    options={[
                        {key: 'recent', label: 'Most recent'},
                        {key: 'top', label: 'Top voted'}
                ]} />
            </DemoSection>
            <DemoSection label='Toggle'>
                <Toggle label='Toggle' value={switchValue} onChange={setSwitchValue} />
            </DemoSection>
            <DemoSection label='Link'>
                {/* <LinkText type='small' url='https://www.google.com' label='Link' /> */}
                <RichText text={inputString} />
                <RichText label='Text with a {param} and a [link]({url})' formatParams={{param: 'parameter', url: 'https://example.com'}} />
            </DemoSection>
            <DemoSection label='Breadcrumb'>
                <SpacedArray horiz>
                    <BreadCrumb icon={IconCloseBig} />
                    <BreadCrumb icon={IconLeftArrowBig} />
                    <BreadCrumb icon={IconCommentBig} />
                </SpacedArray>
            </DemoSection>
            <DemoSection label='Banner Icon Button'>
                <SpacedArray>
                    <BannerIconButton type='close' />
                    <BannerIconButton type='info' />
                </SpacedArray>
            </DemoSection>

        </Narrow>
     </ConversationScreen>
}

function ModalScreen() {
    const [shown, setShown] = useState(false);
    const [shown2, setShown2] = useState(false);

    const buttonRow = <HorizBox center>
        <CTAButton wide type='secondary' label='Action 1' onPress={() => setShown2(false)} />
        <Pad />
        <CTAButton wide label='Action 2' onPress={() => setShown2(false)} />
    </HorizBox>

    return <ConversationScreen>
        <DemoSection label='Modal'>
            <CTAButton label='Basic Modal' onPress={() => setShown(true)} />
            {shown && <Modal onClose={() => setShown(false)}>
                <PadBox horiz={20} vert={20}><UtilityText text='Content'/></PadBox>
            </Modal>}
            <CTAButton label='Modal with Buttons' onPress={() => setShown2(true)} />
            {shown2 && <Modal onClose={() => setShown2(false)} buttonRow={buttonRow} >
                <PadBox horiz={20} vert={20}><UtilityText text='Content'/></PadBox>
            </Modal>}
        </DemoSection>
    </ConversationScreen>
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

function TeaserDemoScreen() {
    return <ConversationScreen>
        <Narrow>
            <BasicTeaser formatParams={{count: 22, singular: 'comment', plural: 'comments'}} />
        </Narrow>
    </ConversationScreen>
}

function BannerDemoScreen() {
    return <ConversationScreen>
            <DemoSection label='Top Banner'>
                <TopBanner /* rightIcon={<IconInfo />} */>
                    <RichText label='🚧 **Moderation under construction:** We are still tuning auto-moderator triggering' />
                </TopBanner>
            </DemoSection>
            <DemoSection label='Banner'>
                <Narrow>
                    <Banner>
                        <Heading label='This is a warning' />
                        <Pad size={16} />
                        <RichText label='This is a **very** important problem'/>
                    </Banner>
                </Narrow>
                <Narrow>
                    <Banner>
                        <Tag type='subtle' label='Recommendation' />
                        <Pad size={16} />
                        <Heading label='This is a a recommendation' />
                        <Pad size={16} />
                        <RichText label='This is a **very** important problem'/>
                    </Banner>
                </Narrow>
            </DemoSection>
            <DemoSection label='Clickable Banner'>
                <Narrow>
                    <ClickableBanner>
                        <RichText label='This is a **very** important problem. You need to make sure you address it or terrible things will happen. Click the info box to learn more.'/>
                    </ClickableBanner>
                    <Pad/>
                    <ClickableBanner iconType='close'>
                        <RichText label='This is a **minor** problem. Click to close'/>
                    </ClickableBanner>

                </Narrow>
            </DemoSection>
    </ConversationScreen>
} 

function ComponentDemoScreen() {
    return <ConversationScreen>
        <Narrow>
            {/* <ContentHeading label='Component Groups' /> */}
            <Pad size={20} />
            <SpacedArray>
                <Heading label='Component Demos' />
                <CTAButton label='Text' onPress={() => pushSubscreen('text')} />
                <CTAButton label='Profile' onPress={() => pushSubscreen('profile')} />
                <CTAButton label='Button' onPress={() => pushSubscreen('button')} />
                <CTAButton label='Comment' onPress={() => pushSubscreen('comment')} />
                <CTAButton label='Banner' onPress={() => pushSubscreen('banner')} />
                <CTAButton label='Modal' onPress={() => pushSubscreen('modal')} />
                <CTAButton label='Teaser' onPress={() => pushSubscreen('teaserDemo')} />
                <Pad />
                <Heading label='Structure Demos' />
                <CTAButton label='Simple Comments' onPress={() => gotoInstance({structureKey: 'simplecomments', instanceKey: 'demo'})} />                
            </SpacedArray>
        </Narrow>
    </ConversationScreen>
}


function DemoSection({label, horiz=false, children}) {
    return <View style={{marginBottom: 32}}>
        <DemoHeader label={label} />
        <Pad size={8} />
        <SpacedArray horiz={horiz}>{children}</SpacedArray>
    </View>
}

function DemoHeader({label}) {
    const s = DemoHeaderStyle;
    return <Text style={s.header}>{label}</Text>
}
const DemoHeaderStyle = StyleSheet.create({
    header: {
        fontFamily: 'sans-serif',
        fontSize: 24,
        lineHeight: 32
    }
})

function SpacedArray({pad=16, horiz=false, children}) {
    if (children.length > 1) {
        return <View style={horiz ? {flexDirection: 'row'} : null}>
            {children.map((c, i) => <View key={i} style={horiz ? {flexDirection: 'row'} : null}>
                {c}
                {i < children.length - 1 ? <Pad size={pad} /> : null}
            </View>)}
        </View>
    } else {
        return children;
    }
}
