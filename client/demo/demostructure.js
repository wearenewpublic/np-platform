import React from "react";
import { EditorialHeading, Heading, LinkText, UtilityText } from "../component/text";
import { CTAButton } from "../component/button";
import { gotoInstance, pushSubscreen } from "../util/navigate";
import { ConversationScreen, HeaderBox, Narrow, Pad, PadBox, Separator, WrapBox } from "../component/basics";
import { useConfig } from "../util/features";
import { colorRed } from "../component/color";


export const ComponentDemoStructure = {
    key: 'componentdemo',
    name: 'Component Demo',
    screen: ComponentDemoScreen,
    subscreens: {
        page: PageScreen,
    },
    defaultConfig: {
        componentSections: [],
        structures: [],  
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
        {/* <PadBox horiz={20} vert={20}> */}
        <Narrow>
            {React.createElement(page.screen)}
        </Narrow>
        {/* </PadBox> */}
    </ConversationScreen>
}

function ComponentDemoScreen() {
    const {componentSections, structures} = useConfig();

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
                                    pushSubscreen('page', {pageKey: page.key})
                                }  />
                            </PadBox>                    
                        )}
                    </WrapBox>
                </PadBox>
            )}
            <Heading level={1} label='Structure Demos' />
            <Pad size={10} />
            {structures.map(structure =>  
                <PadBox key={structure.key} vert={10}>
                    <CTAButton label={structure.label} onPress={() => 
                        gotoInstance({
                            structureKey: structure.key, 
                            instanceKey: structure.instanceKey ?? 'demo'})} 
                    />  
                </PadBox>          
            )}
        </Narrow>
    </ConversationScreen>
}
