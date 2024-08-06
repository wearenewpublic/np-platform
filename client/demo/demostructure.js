import React from "react";
import { EditorialHeading, Heading, LinkText, UtilityText } from "../component/text";
import { CTAButton } from "../component/button";
import { gotoInstance, pushSubscreen } from "../util/navigate";
import { ConversationScreen, HeaderBox, Narrow, Pad, PadBox, Separator, WrapBox } from "../component/basics";
import { useConfig } from "../util/features";
import { colorRed } from "../component/color";
import { View } from "react-native";
import { useDatastore } from "../util/datastore";

export const ComponentDemoStructure = {
    key: 'componentdemo',
    name: 'Component Demo',
    screen: ComponentDemoScreen,
    subscreens: {
        page: PageScreen,
        demo: DemoScreen,
    },
    defaultConfig: {
        componentSections: [],
        structureDemos: [],  
    }
}

function findPage({componentSections, pageKey}) {
    var foundPage = null;
    var foundSection = null;
    componentSections.forEach(section => {
        section.pages.forEach(page => {
            if (page.key == pageKey) {
                foundSection = section;
                foundPage = page;
            }
        })
    })
    return {section: foundSection, page:foundPage};
}

function PageScreen({pageKey}) {
    const {componentSections} = useConfig();
    const {page, section} = findPage({componentSections, pageKey});
    const designUrl = page.designUrl ?? section.designUrl;;

    return <ConversationScreen>
        <HeaderBox>
            <Heading level={1} label={page.label} />
            <Pad size={8} />
            {designUrl && <LinkText label='Design' url={designUrl} />}
            {!designUrl && <UtilityText color={colorRed} label='No design link' />}
        </HeaderBox>
        <Pad />
        <Narrow>
            {React.createElement(page.screen)}
        </Narrow>
    </ConversationScreen>
}

function DemoScreen({demoKey}) {
    const {structureDemos} = useConfig();
    const demo = structureDemos.find(demo => demo.key == demoKey);
    
    return <View style={{position: 'absolute', left:0, right:0, top:0, bottom:0, backgroundColor: 'red'}}>
        {React.createElement(demo.screen)}
    </View>
}


function ComponentDemoScreen() {
    const {componentSections, structureDemos} = useConfig();
    const datastore = useDatastore();

    return <ConversationScreen>
        <Narrow>
            <Heading level={1} label='Component Demos' />
            {componentSections.map(section => 
                <PadBox vert={20} key={section.label}>
                    <Heading level={2} label={section.label} />
                    <Pad size={8} />
                    <WrapBox>
                        {section.pages.map((page, j) => 
                            <PadBox vert={10} horiz={10} key={page.key}>
                                <CTAButton label={page.label} onPress={() => 
                                    datastore.pushSubscreen('page', {pageKey: page.key})
                                }  />
                            </PadBox>                    
                        )}
                    </WrapBox>
                </PadBox>
            )}
            <Heading level={1} label='Structure/Feature Demos' />
            <Pad size={10} />
            {structureDemos.map(structure =>  
                <PadBox key={structure.key} vert={10}>
                    <CTAButton label={structure.label} onPress={() => 
                        datastore.pushSubscreen('demo', {demoKey: structure.key})} />
                </PadBox>          
            )}
        </Narrow>
    </ConversationScreen>
}
