import React from "react";
import { EditorialHeading, Heading, LinkText, UtilityText } from "../component/text";
import { CTAButton } from "../component/button";
import { gotoInstance, pushSubscreen } from "../util/navigate";
import { ConversationScreen, HeaderBox, Narrow, Pad, PadBox, Separator, WrapBox } from "../component/basics";
import { useConfig } from "../util/features";
import { colorRed } from "../component/color";
import { View } from "react-native";
import { useDatastore } from "../util/datastore";
import { DemoStory, DemoStorySet } from "../component/demo";

export const ComponentDemoStructure = {
    key: 'componentdemo',
    name: 'Component Demo',
    screen: ComponentDemoScreen,
    subscreens: {
        page: ComponentPageScreen,
        structure: StructureScreen,
        feature: FeatureScreen,
    },
    defaultConfig: {
        componentSections: [],
        structureSections: [],
        featureSections: [],
        structureDemos: [],  
    }
}

function mergeSectionsWithSameKey(sectionLists) {
    const mergedSections = {};

    sectionLists.forEach(section => {
        const { label, key, pages } = section;
        
        if (!mergedSections[key]) {
            mergedSections[key] = { label, key, pages: [...pages] };
        } else {
            mergedSections[key].pages = [
                ...mergedSections[key].pages,
                ...pages
            ];
        }
    });

    return Object.values(mergedSections);
}

function findPage({sections, pageKey}) {
    var foundPage = null;
    var foundSection = null;
    sections.forEach(section => {
        section.pages.forEach(page => {
            if (page.key == pageKey) {
                foundSection = section;
                foundPage = page;
            }
        })
    })
    return {section: foundSection, page:foundPage};
}

function ComponentPageScreen({pageKey}) {
    const {componentSections} = useConfig();
    const {page, section} = findPage({sections:componentSections, pageKey});
    const designUrl = page.designUrl ?? section.designUrl;;

    console.log('page', page);

    return <ConversationScreen>
        <HeaderBox>
            <Heading level={1} label={page.label} />
            <Pad size={8} />
            {designUrl && <LinkText label='Design' url={designUrl} />}
            {!designUrl && <UtilityText color={colorRed} label='No design link' />}
        </HeaderBox>
        <Pad />
        <Narrow>
            {page.screen && React.createElement(page.screen)}
            {page.storySets && page.storySets()?.map((storySet, i) =>
                <DemoStorySet key={i} storySet={storySet} />
            )}
        </Narrow>
    </ConversationScreen>
}

function StructureScreen({pageKey}) {
    const {structureSections} = useConfig();
    const {page, section} = findPage({sections:structureSections, pageKey});
    
    return <View style={{position: 'absolute', left:0, right:0, top:0, bottom:0, backgroundColor: 'red'}}>
        {React.createElement(page.screen)}
    </View>
}

function FeatureScreen({pageKey}) {
    const {featureSections} = useConfig();
    const {page, section} = findPage({sections:featureSections, pageKey});
    console.log('featureScreen', {page, section, pageKey,featureSections});
    
    return <View style={{position: 'absolute', left:0, right:0, top:0, bottom:0, backgroundColor: 'red'}}>
        {React.createElement(page.screen)}
    </View>
}



function DemoPageSection({label, screenKey, sections}) {
    const datastore = useDatastore();

    return <View>
        <Heading level={1} label={label} />
        {sections.map(section => 
            <PadBox vert={20} key={section.label}>
                <Heading level={2} label={section.label} />
                <Pad size={8} />
                <WrapBox>
                    {section.pages.map((page, j) => 
                        <PadBox vert={10} horiz={10} key={page.key}>
                            <CTAButton label={page.label} onPress={() => 
                                datastore.pushSubscreen(screenKey, {pageKey: page.key})
                            }  />
                        </PadBox>                    
                    )}
                </WrapBox>
            </PadBox>
        )}
    </View>
}


function ComponentDemoScreen() {
    const {componentSections, structureSections, featureSections} = useConfig();

    const mergedCommentSections = mergeSectionsWithSameKey(componentSections);
    const mergedStructureSections = mergeSectionsWithSameKey(structureSections);
    const mergedFeatureSections = mergeSectionsWithSameKey(featureSections);

    return <ConversationScreen>
        <Narrow>
            <DemoPageSection label='Components' screenKey='page' sections={mergedCommentSections} />
            <DemoPageSection label='Structures' screenKey='structure' sections={mergedStructureSections} />
            <DemoPageSection label='Features' screenKey='feature' sections={mergedFeatureSections} />
        </Narrow>
    </ConversationScreen>
}
