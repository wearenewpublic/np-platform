import { Byline, FacePile, ProfilePhoto } from "../component/people";
import { usePersonaKey } from "../util/datastore";
import { IconAudio, IconChevronDown, IconClose, IconCloseBig, IconComment, IconCommentBig, IconEdit, IconEmoji, IconImage, IconLeftArrowBig, IconReply, IconReport, IconSave, IconUpvote, IconUpvoted, IconVideo } from "../component/icon";
import { CharacterCounter, CircleCount, DataVizText, EditorialHeading, Heading, Paragraph, TextField, TextFieldButton, UtilityText } from "../component/text";
import { colorBlack, colorPink, colorRed, colorTextBlue, colorTextGrey } from "../component/color";
import { BannerIconButton, BreadCrumb, CTAButton, DropDownSelector, ExpandButton, IconButton, PhotoPile, PopupPanel, ReactionButton, SubtleButton, Tag, TextButton } from "../component/button";
import { Checkbox, Toggle, RadioOption, RadioGroup, FormField, AccordionField } from "../component/form";
import { useState } from "react";
import { RichText } from "../component/richtext";
import { ConversationScreen, HorizBox, Narrow, Pad, PadBox } from "../component/basics";
import { BasicTeaser } from "../component/teaser";
import { Banner, ClickableBanner, TopBanner } from "../component/banner";
import { TrashCan, Pin } from "@carbon/icons-react";
import { Modal } from "../component/modal";
import { DemoSection, SpacedArray } from "../component/demo";
import { Image, View } from "react-native";
import { FeatureMenuScreen } from "./featuremenudemo";

export const DesignSystemDemoFeature = {
    key: 'demo_designsystem',
    name: 'Core Design System',
    config: {
        componentSections: [
            {label: 'Core Design System', designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=3-32&m=dev', pages: [
                {
                    label: 'Text', key: 'text', screen: TextScreen,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1102-2973&m=dev',
                },
                {label: 'Profile', key: 'profile', screen: ProfileScreen },
                {label: 'Button', key: 'button', screen: ButtonScreen },
                {label: 'Form', key: 'form', screen: FormScreen},
                {label: 'Banner', key: 'banner', screen: BannerDemoScreen},
                {label: 'Modal', key: 'modal', screen: ModalScreen},
                {label: 'Feature Menu', key: 'featuremenu', screen: FeatureMenuScreen}
            ]}
        ]
    }
}

function TextScreen() {
    const [text, setText] = useState(null);

    return <View>
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
                <EditorialHeading label='Editorial Heading Large' />
                <EditorialHeading italic label='Editorial Heading Large Italic' />
                <EditorialHeading type='small' label='Editorial Heading Small' />
                <EditorialHeading type='small' italic label='Editorial Heading Small Italic' />
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
        </View>
}

function ProfileScreen() {
    const personaKey = usePersonaKey();
    const p = personaKey;
    return <View>
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
        </View>
}

function FormScreen() {
    const [switchValue, setSwitchValue] = useState(false);
    const [radioValue, setRadioValue] = useState(null);
    // const [oldRadioValue, setRadioValue] = useState(null);

    return <View>
            <DemoSection label='Form Field'>
                <FormField label='Field label'>
                    <TextField placeholder='Text Field' />
                </FormField>
                <FormField label='Required Field' required>
                    <TextField placeholder='Text Field' />
                </FormField>
                <FormField label='Fiend with Description' descriptionLabel='Description appears below' >
                    <TextField placeholder='Text Field' />
                </FormField>
                <FormField label='Fiend with Error' errorLabel='This is an error' >
                    <TextField error placeholder='Text Field' value='Invalid Text' />
                </FormField>
            </DemoSection>
            <DemoSection label='Toggle'>
                <Toggle label='Toggle' value={switchValue} onChange={setSwitchValue} />
                <Toggle emoji='😭' label='Toggle with emoji' value={switchValue} onChange={setSwitchValue} />
                <Toggle emoji='😭' label='Spread Toggle' spread value={switchValue} onChange={setSwitchValue} />
                <Toggle label='This is a toggle with a very long label that needs to be wrapped onto another screen in order to not look bag' value={switchValue} onChange={setSwitchValue} />
            </DemoSection>
            <DemoSection label='Checkbox'>
                <Checkbox label='Checkbox' value={switchValue} onChange={setSwitchValue} />
                <Checkbox emoji='🔥' label='Checkbox with emoji' value={switchValue} onChange={setSwitchValue} />
            </DemoSection>
            <DemoSection label='Radio Group'>
                <RadioGroup value={radioValue} onChange={setRadioValue} >
                    <RadioOption label='Cat' radioKey='cat' />
                    <RadioOption label='Dog' radioKey='dog' />
                    <RadioOption label='Komodo Dragon' radioKey='Komodo Dragon' />                       
                </RadioGroup>
                <UtilityText label='Selected: {value}' formatParams={{value: radioValue}} />
            </DemoSection>
            <DemoSection label='Accordion Field'>
                <AccordionField titleContent={<UtilityText strong label='Title'/>}>
                    <UtilityText label='Content' />
                </AccordionField>
                <AccordionField titleContent={
                        <HorizBox center>
                            <UtilityText strong label='With Count'/>
                            <Pad size={8} />
                            <CircleCount count={3} />
                        </HorizBox>                        
                    }>
                    <UtilityText label='Content' />
                </AccordionField>
            </DemoSection>
        </View>
}

function ButtonScreen() {
    const [dropDownValue, setDropDownValue] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const inputString = 'Check this link [OpenAI](https://www.openai.com) or visit https://www.example.com directly.';
    const faceUri = 'https://psi.newpublic.org/faces/face1.jpeg';

    function onPress() {
        console.log('press');
    }

    return <View>
            <DemoSection label='CTA Button'>
                <SpacedArray horiz>
                    <CTAButton label='Primary' type='primary' onPress={onPress} />
                    <CTAButton label='Secondary' type='secondary' onPress={onPress} />
                    <CTAButton label='Accent' type='accent' onPress={onPress} />
                    <CTAButton icon={<TrashCan style={{fill: colorRed}} />} label='Delete' type='delete' onPress={onPress} />
                    <CTAButton label='✨ Emoji' type='accent' onPress={onPress} />
                    <CTAButton label='Disabled' type='primary' disabled />
                </SpacedArray>
                <CTAButton wide label='Wide' onPress={onPress} />
                <CTAButton compact label='Compact' onPress={onPress} />
            </DemoSection>
            <DemoSection label='Action Button'>
                <SpacedArray horiz>
                    <IconButton icon={IconReply} label='Respond' onPress={onPress} />
                    <IconButton icon={IconComment} label='Respond' onPress={onPress} />
                    <IconButton icon={IconEdit} label='Edit' onPress={onPress} />
                    <IconButton icon={IconSave} label='Save' onPress={onPress} />
                    <IconButton icon={IconImage} label='Image' onPress={onPress} />
                    <IconButton icon={IconAudio} label='Audio' onPress={onPress} />
                    <IconButton icon={IconVideo} label='Video' onPress={onPress} />
                    <IconButton icon={IconEmoji} label='Emoji' onPress={onPress} />
                </SpacedArray>
                <IconButton wide icon={IconComment} label='Wide Button' onPress={onPress} />
            </DemoSection>
            <DemoSection label='Subtle Button'>
                <SpacedArray horiz>
                    <SubtleButton icon={IconReply} label='Reply' onPress={onPress} />                    
                    <SubtleButton icon={IconUpvote} label='Upvote ({count})' formatParams={{count: 22}} onPress={onPress} />
                    <SubtleButton icon={IconUpvoted} label='Upvoted ({count})' formatParams={{count: 23}} color={colorBlack} onPress={onPress} />
                    <SubtleButton icon={IconReport} label='Report' onPress={onPress} />
                    <SubtleButton icon={IconComment} label='{count} {noun}' 
                        formatParams={{singular: 'comment', plural: 'comments', count: 12}} onPress={onPress} />
                    <SubtleButton icon={Pin} label='Community Guidelines' onPress={onPress} />
                </SpacedArray>
            </DemoSection>
            <DemoSection label='Text Button'>
                <SpacedArray horiz>
                    <TextButton leftIcon={IconClose} label='Close' onPress={onPress} />
                    <TextButton label='Show more comments' rightIcon={IconChevronDown} color={colorTextBlue} onPress={onPress} />
                    <TextButton label='Cancel' underline color={colorTextGrey} onPress={onPress} />
                </SpacedArray>
                <SpacedArray horiz>
                    <TextButton type='small' text={'This is a question'} strong onPress={onPress} />
                    <TextButton type='small' paragraph text={'This is a paragraph question'} strong onPress={onPress} />
                </SpacedArray>
                <SpacedArray horiz>
                    <TextButton label='Editoral Large Italic' editorial type='large' italic onPress={onPress} />
                    <TextButton label='Editoral Small Italic' editorial type='small' italic onPress={onPress} />
                    <TextButton label='Heading 1' heading level={1} onPress={onPress} />
                    <TextButton label='Heading 2' heading level={2} onPress={onPress} />

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
                <Tag emoji='🔥' label='Emphasized Tag' type='emphasized' color={colorPink} />
                <Tag label='Tiny Tag' type='tiny' />
            </DemoSection>
            <DemoSection label='Reaction Button'>
                <ReactionButton emoji='🤝🏽' label='Respect' count={0} onPress={onPress} />
                <ReactionButton emoji='🤝🏽' label='Respect' count={1} onPress={onPress} />
                <ReactionButton emoji='🤝🏽' label='Selected' count={1} selected onPress={onPress} />                
                <ReactionButton emoji='🤝🏽' label='View only' count={2} viewOnly onPress={onPress} />
                <ReactionButton emoji='🤝🏽' text='Text not label' onPress={onPress} />

            </DemoSection>
            <DemoSection label='DropDownSelector'>
                <DropDownSelector label='Sort by' 
                    value={dropDownValue} onChange={setDropDownValue}
                    options={[
                        {key: 'recent', label: 'Most recent'},
                        {key: 'top', label: 'Top voted'}
                ]} />
            </DemoSection>
            <DemoSection label='Popup Panel'>
                <PopupPanel popupContent={() => <UtilityText label='Panel content'/>}>
                    <UtilityText label='Open Panel'/>
               </PopupPanel>
               <PopupPanel popupContent={() => 
                        <Image style={{width: 1000, height: 1000}} source={{uri: faceUri}} />
                    }>
                    <UtilityText label='Open Tall Panel'/>
               </PopupPanel>
            </DemoSection>
            <DemoSection label='Link'>
                {/* <LinkText type='small' url='https://www.google.com' label='Link' /> */}
                <RichText text={inputString} />
                <RichText label='Text with a {param} and a [link]({url})' formatParams={{param: 'parameter', url: 'https://example.com'}} />
            </DemoSection>
            <DemoSection label='Breadcrumb'>
                <SpacedArray horiz>
                    <BreadCrumb icon={IconCloseBig} onPress={onPress} />
                    <BreadCrumb icon={IconLeftArrowBig} onPress={onPress} />
                    <BreadCrumb icon={IconCommentBig} onPress={onPress} />
                </SpacedArray>
            </DemoSection>
            <DemoSection label='Banner Icon Button'>
                <SpacedArray>
                    <BannerIconButton type='close' onPress={onPress} />
                    <BannerIconButton type='info' onPress={onPress} />
                </SpacedArray>
            </DemoSection>

        </View>
}

function ModalScreen() {
    const [shown, setShown] = useState(false);
    const [shown2, setShown2] = useState(false);

    const buttonRow = <HorizBox center>
        <CTAButton wide type='secondary' label='Action 1' onPress={() => setShown2(false)} />
        <Pad />
        <CTAButton wide label='Action 2' onPress={() => setShown2(false)} />
    </HorizBox>

    return <View>
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
    </View>
}

function TeaserDemoScreen() {
    return <View>
            <BasicTeaser formatParams={{count: 22, singular: 'comment', plural: 'comments'}} />
        </View>
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

