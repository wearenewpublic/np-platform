import { StructureDemo } from "../util/instance";

export const ProfileDemoFeature = {
    key: 'demo_profile',
    name: 'Profile Demo',
    config: {
        structureSections: [
            {label: 'Core Structures', key: 'core', pages: [
                {label: 'Profile', key: 'profile', screen: ProfileDemoScreen},
            ]},
            {label: 'Config Slots', key: 'slots', pages: [
                {label: 'Profile Config', key: 'profileconfigslots', screen: ProfileConfigSlots}
            ]},
        ],
        featureSections: [
            {label: 'Profile', key: 'profile', pages: [
                {label: 'Comments', key: 'profile-comments', screen: ProfileCommentsScreen},
            ]}
        ]
    }
}

const derived_comment = [
    {key: 1, from: 'a', text: 'I love this movie!'},
    {key: 2, from: 'a', text: "I love cats but Komodo dragons are cool too!\nThey are super cool!"},

]

function ProfileDemoScreen() {
    const globals = {
        initialized: true
    }
    return <StructureDemo structureKey='profile' instanceKey='a' 
        globals={globals} collections={{derived_comment}}
    />   
}

function ProfileCommentsScreen() {
    const globals = {
        initialized: true
    }
    return <StructureDemo structureKey='profile' instanceKey='a' 
        globals={globals} collections={{derived_comment}}
        features={{profilecomments:true}}
    />   
}


function ProfileConfigSlots() {
    const globals = {
        initialized: true
    }
    return <StructureDemo structureKey='profile' instanceKey='a' 
        globals={globals} collections={{derived_comment}}
        features={{config_profile: true}} 
    />   
}
