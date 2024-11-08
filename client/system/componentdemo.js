import React, { useState } from "react";
import { Heading, LinkText, TextField, UtilityText } from "../component/text";
import { IconButton } from "../component/button";
import { ConversationScreen, FlowBox, HeaderBox, LoadingScreen, Narrow, Pad, PadBox } from "../component/basics";
import { useConfig } from "../util/features";
import { colorGreyPopupBackground, colorRed } from "../component/color";
import { View } from "react-native";
import { useDatastore } from "../util/datastore";
import { DemoStorySet } from "./demo";
import { AccordionField } from "../component/form";
import { Catcher } from "./catcher";
import { sortBy, toBool } from "../util/util";

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

        openLinksInNewTab: false,
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

    if (!page) {
        return <LoadingScreen label='No such page'/>
    }

    const designUrl = page?.designUrl ?? section.designUrl;

    return <ConversationScreen>
        <HeaderBox backgroundColor={colorGreyPopupBackground}>
            <Heading level={1} label={page.label} />
            <Pad size={8} />
            {designUrl && <LinkText label='Design Link' url={designUrl} />}
            {!designUrl && <UtilityText color={colorRed} label='No design link' />}
        </HeaderBox>
        <Pad />
        <Narrow>
            {page.screen && React.createElement(page.screen)}
            {page.storySets && page.storySets()?.map((storySet, i) =>
                <Catcher key={i}>
                    <DemoStorySet storySet={storySet} />
                </Catcher>
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



function DemoPageSection({search, label, screenKey, sections}) {
    const datastore = useDatastore();

    return <View>
        <Heading level={1} label={label} />
        {sections.map(section => 
            (!search || section.pages.some(page => page.label.toLowerCase().includes(search.toLowerCase()))) &&
                <AccordionField key={section.label} forceOpen={toBool(search)}
                    titleContent={<UtilityText weight='medium' label={section.label} />} >
                    <FlowBox>
                        {sortBy(section.pages, 'label').map((page, j) => 
                            page.label.toLowerCase().includes(search.toLowerCase()) &&
                            <PadBox vert={10} horiz={10} key={page.key}>
                                <IconButton compact type='secondary' label={page.label} onPress={() => 
                                    datastore.pushSubscreen(screenKey, {pageKey: page.key})
                                }  />
                            </PadBox>                    
                        )}
                    </FlowBox>
                </AccordionField>
        )}
        <Pad />
    </View>
}


function ComponentDemoScreen() {
    const {componentSections, structureSections, featureSections} = useConfig();
    const [search, setSearch] = useState('');

    const mergedCommentSections = mergeSectionsWithSameKey(componentSections);
    const mergedStructureSections = mergeSectionsWithSameKey(structureSections);
    const mergedFeatureSections = mergeSectionsWithSameKey(featureSections);

    return <ConversationScreen>
        <Narrow>
            <TextField label='Search' placeholder='Search...' value={search} onChange={setSearch} />
            <Pad />
            <DemoPageSection search={search} label='Components' screenKey='page' sections={mergedCommentSections} />
            <DemoPageSection search={search} label='Structures' screenKey='structure' sections={mergedStructureSections} />
            <DemoPageSection search={search} label='Features' screenKey='feature' sections={mergedFeatureSections} />
        </Narrow>
    </ConversationScreen>
}
