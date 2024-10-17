import { EmbeddedInstance } from "../util/instance"

export const EmbeddedInstanceDemoFeature = {
    name: 'Embedded Instance Demo',
    key: 'demo_embedded',
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {
                    label: 'Embedded Instance', key: 'embeddedinstance', storySets: embeddedStorySets,
                    designUrl: 'https://www.figma.com/design/MX0AcO8d0ZlCBs4e9vkl5f/PSI-Design-System?node-id=3-32&m=dev'
                },
            ]}
        ]
    }
}


function embeddedStorySets() {return [
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
