import { Byline, FaceButton, FacePile, LetterFace, ProfilePhoto } from "../component/people";
import { Datastore } from "../util/datastore";
import { IconUpvote, IconUpvoted } from "../component/icon";
import { CharacterCounter, CircleCount, DataVizText, EditorialHeading, Heading, Paragraph, TextField, TextFieldButton, UtilityText } from "../component/text";
import { colorBlack, colorLightGreen, colorPink, colorRed, colorTextBlue, colorTextGrey } from "../component/color";
import { BannerIconButton, BreadCrumb, CTAButton, DropDownSelector, ExpandButton, FilterButton, IconButton, PhotoPile, PopupPanel, ReactionButton, SubtleButton, Tag, ClickableTag, TextButton } from "../component/button";
import { Checkbox, Toggle, RadioOption, RadioGroup, FormField, AccordionField } from "../component/form";
import { useState } from "react";
import { RichText } from "../component/richtext";
import { Card, ConversationScreen, FlowBox, HorizBox, Narrow, Pad, PadBox, ShadowBox } from "../component/basics";
import { Banner, BannerMessage, ClickableBanner, TopBanner } from "../component/banner";
import { TrashCan, Pin, Chat, ChevronDown, Reply, Image as CarbonImage, Hearing, Video, FaceAdd, Edit, Bookmark, Flag, Close, ArrowLeft } from "@carbon/icons-react";
import { Modal } from "../component/modal";
import { CLICK, DemoSection, POPUP, SpacedArray } from "../system/demo";
import { Image, View } from "react-native";
import { FeatureMenuScreen } from "./featuremenu-demo";

export const DesignSystemDemoFeature = {
    key: 'demo_designsystem',
    name: 'Core Design System',
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=3-32&m=dev', pages: [
                {
                    label: 'Text', key: 'text', screen: TextScreen,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1102-3167&t=MC9nppcf9h2iJDKP-1',
                },
                {  
                    label: 'Text Fields', key: 'textfield', screen: TextFieldScreen,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1112-30186&t=MC9nppcf9h2iJDKP-1'
                },
                {
                    label: 'People', key: 'profile', screen: ProfileScreen,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1102-4732&t=MC9nppcf9h2iJDKP-1'
                },
                {
                    label: 'Buttons & Links', key: 'button', screen: ButtonsAndLinksScreen,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1104-5678&t=MC9nppcf9h2iJDKP-1' 
                },
                {
                    label: 'Dropdowns', key: 'dropdown', screen: DropdownScreen,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=6295-30781&t=MC9nppcf9h2iJDKP-1',                    
                },
                {
                    label: 'Tags & Badges', key: 'tags', screen: TagsScreen,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1418-6360&t=MC9nppcf9h2iJDKP-1'
                },
                {
                    label: 'Form', key: 'form', screen: FormScreen,
                    designUrl:'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1415-5890&t=MC9nppcf9h2iJDKP-1'
                },
                {
                    label: 'Banner', key: 'banner', screen: BannerDemoScreen,
                    designUrl:'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=1278-9461&t=MC9nppcf9h2iJDKP-1',
                },
                {
                    label: 'Modal', key: 'modal', storySets: modalStorySet,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=6308-21252&t=MC9nppcf9h2iJDKP-1'
                },
                {
                    label: 'Feature Menu', key: 'featuremenu', screen: FeatureMenuScreen,
                    designUrl:'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=6311-21920&t=MC9nppcf9h2iJDKP-1'
                },
                { 
                    label: 'Misc Extras', key: 'misc', screen: MiscScreen,
                }
            ]}
        ]
    }
}

function TextScreen() {
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

        </View>
}

function TextFieldScreen() {
    const [text, setText] = useState(null);

    return <View>
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

function profilePhotoLayer({persona}) {
    return <View key='first-letter' style={{position: 'absolute', left: 0, top: 0}}>
        <Tag key='letter' type='tiny' label={persona.name[0]} />
    </View>
}

function profilePhotoLayerTwo({persona}) {    
    return <View key='second-letter' style={{position: 'absolute', right: 0, bottom: 0}}>
        <Tag key='letter' color={colorLightGreen} type='tiny' label={persona.name[1]} />
    </View>
}


function ProfileScreen() {
    const [selected, setSelected] = useState(false)
    function onPress() {console.log('press')}
    return <Datastore>
            <DemoSection label='Profile Photo'>
                <SpacedArray horiz pad={8}>
                    <ProfilePhoto userId='a' />
                    <ProfilePhoto userId='b' type="small"/>
                    <ProfilePhoto userId='c' type="tiny"/>
                    <ProfilePhoto userId='d' check={true} />
                    <ProfilePhoto userId='e' type="small" check/>
                    <ProfilePhoto userId='f' type="tiny" check/>
                </SpacedArray>
                <SpacedArray horiz pad={8}>
                    <ProfilePhoto userId='x' />
                    <ProfilePhoto userId='y' type="small"/>
                    <ProfilePhoto userId='z' type="tiny"/>
                </SpacedArray>
                <Datastore config={{profilePhotoLayers:[profilePhotoLayer]}}>
                    <SpacedArray horiz pad={8}>
                        <ProfilePhoto userId='a' />
                        <ProfilePhoto userId='b' type='small' />
                        <ProfilePhoto userId='c' type='tiny' />
                    </SpacedArray>
                </Datastore>
                <Datastore config={{profilePhotoLayers:[profilePhotoLayer, profilePhotoLayerTwo]}}>
                    <SpacedArray horiz pad={8}>
                        <ProfilePhoto userId='a' />
                        <ProfilePhoto userId='b' type='small' />
                        <ProfilePhoto userId='c' type='tiny' />
                    </SpacedArray>
                </Datastore>
            </DemoSection>
            <DemoSection label='Facepile'>
                <FacePile userIdList={['a','b','c','z']} type='small' />
                <FacePile userIdList={['x','d','e','f','g','h','i','j']} type='tiny' />
            </DemoSection>
            <DemoSection label='Byline'>
                <Byline userId={'a'} type='large' time={Date.now()} />
                <Byline userId={'b'} type='large' time={Date.now() - 1000 * 60 * 10} edited={Date.now()} />
                <Byline userId={'y'} type='large' time={Date.now() - 1000 * 60 * 60 * 10} edited={Date.now()} />
                <Byline userId={'c'} type='small' time={Date.now()} />
                <Byline userId={'d'} type='small' />
                <Byline userId={'e'} type='small' time={Date.now()} edited={Date.now()} />
                <Byline userId={'f'} type='small' photoType='large' />
                <Byline userId={'g'} type='small' photoType='large' time={Date.now()} />
                <Byline userId='x' type='small' photoType='large' time={Date.now()} />
                <Byline userId='z' type='small' photoType='large' time={Date.now()} />
                <Datastore config={{bylineTags:[
                        () => <Tag type='tiny' label='Awesome Person'/>,
                        (persona) => persona.key == 'b' && <Tag type='tiny' label='Superhero'/>,
                    ]}}>
                    <Byline userId='a' type='large' time={Date.now()} />
                    <Pad />
                    <Byline userId='b' type='large' time={Date.now()} edited={Date.now()} />
                    <Pad />
                    <Byline userId='a' type='small' time={Date.now()} />
                </Datastore>

            </DemoSection>
            <DemoSection label='Anonymous'>
                <Byline name='Anonymous User' type='large' time={Date.now()} />
                <Byline name='Anonymous User' type='large' time={Date.now() - 1000 * 60 * 10} edited={Date.now()} />
                <Byline name='Anonymous User' type='small' time={Date.now()} />
                <Byline name='Anonymous User' type='small' />
                <Byline name='Anonymous User' photoType='large' type='small' time={Date.now()} />
                <Byline name='Anonymous User' photoType='large' type='small' />
            </DemoSection>
            <DemoSection label='Letter face' horiz>
                <LetterFace name='dave' type='huge' hue={183} />
                <LetterFace name='bill' type='huge' hue={0} />
                <LetterFace name='jane' type='large' hue={45} />
                <LetterFace name='sarah' type='large' hue={90} />
                <LetterFace name='ella' type='small' hue={135} />
                <LetterFace name='carl' type='small' hue={180} />
                <LetterFace name='mica' type='tiny' hue={225} />
                <LetterFace name='betty' type='tiny' hue={300} />
            </DemoSection>
            <DemoSection horiz label='Face Button'>
                <FaceButton selected={selected} onPress={() => setSelected(!selected)}>
                    <LetterFace name='dave' type='huge' hue={183} />
                </FaceButton>
                <FaceButton selected={!selected} onPress={() => setSelected(!selected)}>
                    <ProfilePhoto userId='a' type='huge' hue={183} />
                </FaceButton>
            </DemoSection>
        </Datastore>
}

function FormScreen() {
    const [switchValue, setSwitchValue] = useState(false);
    const [radioValue, setRadioValue] = useState(null);
    const [text, setText] = useState(null);
    // const [oldRadioValue, setRadioValue] = useState(null);

    return <View>
            <DemoSection label='Form Field'>
                <FormField label='Field label'>
                    <TextField placeholder='Text Field' value={text} onChange={setText} />
                </FormField>
                <FormField label='Required Field' required>
                    <TextField placeholder='Text Field' value={text} setText={setText} />
                </FormField>
                <FormField label='Field with Description' descriptionLabel='Description appears below' >
                    <TextField placeholder='Text Field' value={text} setText={setText} />
                </FormField>
                <FormField label='Field with Error' errorLabel='This is an error' >
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


function ButtonsAndLinksScreen() {
    const [expanded, setExpanded] = useState(false);
    const inputString = 'Check this link [OpenAI](https://www.openai.com) or visit https://www.example.com directly.';

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
                <CTAButton size='compact' label='Compact' onPress={onPress} />
            </DemoSection>
            <DemoSection label='Action Button'>
                <SpacedArray horiz>
                    <IconButton icon={Reply} label='Respond' onPress={onPress} />
                    <IconButton icon={Chat} label='Respond' onPress={onPress} />
                    <IconButton icon={Edit} label='Edit' onPress={onPress} />
                    <IconButton icon={Bookmark} label='Save' onPress={onPress} />
                    <IconButton icon={CarbonImage} label='Image' onPress={onPress} />
                    <IconButton icon={Hearing} label='Audio' onPress={onPress} />
                    <IconButton icon={Video} label='Video' onPress={onPress} />
                    <IconButton icon={FaceAdd} label='Emoji' onPress={onPress} />
                </SpacedArray>
                <IconButton wide icon={Chat} label='Wide Button' onPress={onPress} />
            </DemoSection>
            <DemoSection label='Subtle Button'>
                <SpacedArray horiz>
                    <SubtleButton icon={Reply} label='Reply' onPress={onPress} />                    
                    <SubtleButton icon={IconUpvote} label='Upvote ({count})' formatParams={{count: 22}} onPress={onPress} />
                    <SubtleButton icon={IconUpvoted} label='Upvoted ({count})' formatParams={{count: 23}} color={colorBlack} onPress={onPress} />
                    <SubtleButton icon={Flag} label='Report' onPress={onPress} />
                    <SubtleButton icon={Chat} label='{count} {noun}' 
                        formatParams={{singular: 'comment', plural: 'comments', count: 12}} onPress={onPress} />
                    <SubtleButton icon={Pin} label='Community Guidelines' onPress={onPress} />
                </SpacedArray>
            </DemoSection>
            <DemoSection label='Text Button'>
                <SpacedArray horiz>
                    <TextButton leftIcon={Close} leftIconProps={{size:24}} label='Close' onPress={onPress} />
                    <TextButton label='Show more comments' rightIcon={ChevronDown} rightIconProps={{size:20}} color={colorTextBlue} onPress={onPress} />
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
            <DemoSection horiz label='Expand Button'>
                <ExpandButton userList={['a','b','c','d']} label='{count} {noun}' 
                    formatParams={{count: 22, singular: 'reply', plural: 'replies'}} expanded={expanded} setExpanded={setExpanded} />
                <ExpandButton photoUrlList={['https://picsum.photos/100/100', 'https://picsum.photos/100/100', 'https://picsum.photos/100/100']} 
                    label='{count} related {noun}' 
                    formatParams={{count: 22, singular: 'article', plural: 'articles'}} expanded={expanded} setExpanded={setExpanded} />

            </DemoSection>
            <DemoSection horiz label='Photo Pile'>
                <PhotoPile photoUrlList={['https://picsum.photos/100/100']} />
                <PhotoPile photoUrlList={['https://picsum.photos/100/100', 'https://picsum.photos/100/100']} />
                <PhotoPile photoUrlList={['https://picsum.photos/100/100', 'https://picsum.photos/100/100', 'https://picsum.photos/100/100']} />
            </DemoSection>
            <DemoSection horiz label='Tag'>
                <Tag label='Subtle Tag' type='subtle' />
                <Tag emoji='🔥' label='Emphasized Tag' type='emphasized' color={colorPink} />
                <Tag label='Tiny Tag' type='tiny' />
            </DemoSection>
            <DemoSection horiz label='Reaction Button'>
                <ReactionButton emoji='🤝🏽' label='Respect' count={0} onPress={onPress} />
                <ReactionButton emoji='🤝🏽' label='Respect' count={1} onPress={onPress} />
                <ReactionButton emoji='🤝🏽' label='Selected' count={1} selected onPress={onPress} />                
                <ReactionButton emoji='🤝🏽' label='View only' count={2} viewOnly onPress={onPress} />
                <ReactionButton emoji='🤝🏽' text='Text not label' onPress={onPress} />
            </DemoSection>
            <DemoSection horiz label='Filter Button'>
                <FilterButton emoji='🔍' label='Under Review' count={1} onPress={onPress} />
                <FilterButton label='Selected' count={22} onPress={onPress} />

            </DemoSection>

            <DemoSection label='Link'>
                <RichText text={inputString} />
                <RichText label='Text with a {param} and a [link]({url})' formatParams={{param: 'parameter', url: 'https://example.com'}} />
            </DemoSection>
            <DemoSection horiz label='Breadcrumb'>
                <BreadCrumb icon={Close} iconProps={{size:32}} onPress={onPress} />
                <BreadCrumb icon={ArrowLeft} iconProps={{size:32}} onPress={onPress} />
                <BreadCrumb icon={Chat} iconProps={{size:24}} onPress={onPress} />
            </DemoSection>
            <DemoSection horiz label='Banner Icon Button'>
                <BannerIconButton type='close' onPress={onPress} />
                <BannerIconButton type='info' onPress={onPress} />
            </DemoSection>

        </View>
}

function TagsScreen() {
    return <View>
        <DemoSection label='Tag'>
            <Tag label='Subtle Tag' type='subtle' />
            <Tag emoji='🔥' label='Emphasized Tag' type='emphasized' color={colorPink} />
            <Tag label='Tiny Tag' type='tiny' />
        </DemoSection>
        <DemoSection label='Clickable Tag' color={colorPink}>
            <ClickableTag label='Standard' onPress={() => {}} />
            <ClickableTag label='Standard With Emoji' emoji='🔥' onPress={() => {}} />
        </DemoSection>
    </View>
}

function DropdownScreen() {
    const [dropDownValue, setDropDownValue] = useState(null);
    const faceUri = 'https://psi.newpublic.org/faces/face1.jpeg';

    return <View>
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
        </View>
}

function ModalHolder({label, children}) {
    const [shown, setShown] = useState(false);

    const buttonRow = <CTAButton wide type='secondary' label='I understand' onPress={() => setShown(false)} />

    return <View>
        <CTAButton label={label} onPress={() => setShown(true)} />
        {shown && <Modal buttonRow={buttonRow} onClose={() => setShown(false)}>
            {children}
        </Modal>}
    </View>
}

function modalStorySet() {return [
    {
        label: 'Modal with Buttons',
        content: <ModalHolder label='Open Modal' >
            <PadBox horiz={20} vert={20}><UtilityText label='Content'/></PadBox>
        </ModalHolder>,
        stories: [
            {label: 'Open', actions: [
                CLICK('Open Modal')
            ]},
            {label: 'Open and Close with button', actions: [
                CLICK('Open Modal'), 
                POPUP(CLICK('I understand'))
            ]},
            {label: 'Open and Close with breadcrumb', actions: [
                CLICK('Open Modal'), 
                POPUP(CLICK('close-modal'))
            ]},
            
        ]
    }
]}

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
            <DemoSection label='Banner Message'>
                <BannerMessage label='Banner Message'/>
            </DemoSection>
    </ConversationScreen>
}

function MiscScreen() {
    return <View>
        <DemoSection label='Shadow Box'>
            <ShadowBox>
                <PadBox horiz={20} vert={20}><UtilityText label='Shadow Box'/></PadBox>
            </ShadowBox>
        </DemoSection>
        <DemoSection label='Flow Box'>
            <FlowBox>
                <Tag label='This is Item One'/>
                <Tag label='This is Item Two'/>
                <Tag label='This is Item Three'/>
                <Tag label='This is Item Four'/>
                <Tag label='This is Item Five'/>
            </FlowBox>
        </DemoSection>
        <DemoSection label='Card'>
            <Card>
                <UtilityText label='I am in a card'/>
            </Card>
        </DemoSection>
    </View>
}

