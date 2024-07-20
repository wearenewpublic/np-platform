
import { Heading } from "../component/text";
import { CTAButton } from "../component/button";
import { gotoInstance, pushSubscreen } from "../util/navigate";
import { ConversationScreen, Narrow, Pad, PadBox, WrapBox } from "../component/basics";
import { useConfig } from "../util/features";


export const ComponentDemoStructure = {
    key: 'componentdemo',
    name: 'Component Demo',
    screen: ComponentDemoScreen,
    defaultConfig: {
        componentSections: [],
        structures: [],  
    }
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
                                    pushSubscreen(page.key)
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
