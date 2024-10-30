import { View } from "react-native";
import { CTAButton } from "../component/button";
import { UtilityText } from "../component/text";
import { useDatastore, useModulePublicData, useModuleUserGlobalData, useModuleUserLocalData } from "../util/datastore"
import { EmbeddedInstance } from "../util/instance"
import { HorizBox, Pad } from "../component/basics";
import { CLICK } from "../system/demo";

export const EmbeddedInstanceDemoFeature = {
    name: 'Embedded Instance Demo',
    key: 'demo_embedded',
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {
                    label: 'Data Model', key: 'datamodel', storySets: dataModelStorySets,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=3-32&m=dev'
                },
            ]}
        ]
    }
}

function UserDataTester() {
    const datastore = useDatastore();
    const globalVar = useModuleUserGlobalData('foo', ['wibble']);
    const localVar = useModuleUserLocalData('bar', ['king', 'kong']);
    const publicVar = useModulePublicData('baz', ['one', 'two']);
    return <View>
        <UtilityText text={'Global Var: ' + globalVar} />
        <UtilityText text={'Local Var: ' + localVar}  />
        <UtilityText text={'Public Var: ' + publicVar}  />
        <Pad />
        <HorizBox spread>
            <CTAButton label='Change Global Var' onPress={() => 
                datastore.setModuleUserGlobal('foo', ['wibble'], 'new global')
            } />
            <CTAButton label='Change Local Var' onPress={() => 
                datastore.setModuleUserLocal('bar', ['king', 'kong'], 'new local')
            } />
        </HorizBox>
    </View>
}

function dataModelStorySets() {return [
    {
        label: 'User Data',
        moduleUserGlobal: {foo: {wibble: 'initial global'}},
        moduleUserLocal: {bar: {king: {kong: 'initial local'}}},
        modulePublic: {baz: {one: {two: 'initial public'}}},
        content: <UserDataTester />,
        stories: [
            {label: 'Change Global Var', actions: [
                CLICK('Change Global Var')
            ]},
            {label: 'Change Local Var', actions: [
                CLICK('Change Local Var')
            ]},
        ]
    },
    {
        label: 'Embedded Instance with Feature Override',
        embeddedInstanceData: {simplecomments: {demo: {
            collections: {comment: [
                {key: 1, from: 'a', text: 'This is a comment in an embedded instance'},
            ]},
        }}},
        content: <EmbeddedInstance 
            structureKey='simplecomments' instanceKey='demo' 
            features={{demofilter:true}}
        />,
    },
    {
        label: 'Embedded Instance Subscreen',
        embeddedInstanceData: {simplecomments: {demo: {
            collections: {comment: [
                {key: 1, from: 'a', text: 'This is a comment in an embedded instance'},
            ]},
        }}},
        content: <EmbeddedInstance 
            structureKey='simplecomments' instanceKey='demo' screenKey='composer'
            features={{lengthlimit: true}}
        />        
    }
]}
