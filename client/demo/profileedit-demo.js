import { useState } from "react"
import { ConversationScreen } from "../component/basics"
import { CLICK, DemoSection, INPUT } from "../component/demo"
import { Datastore } from "../util/datastore"
import { StructureDemo } from "../util/instance"
import { ProfileModuleHolder } from "../structure/profile"
import { ProfilePhotoAndNameFeature } from "../feature/ProfilePhotoAndName"

export const ProfileEditDemo = {
    key: 'profileeditdemo',
    name: 'Profile Demo',
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {
                    designUrl: 'https://www.figma.com/design/iP7DEaY8SVqQcEGN6Feipj/Basic-Profile-%2B-Privacy-Settings?node-id=188-1054&m=dev', 
                    label: 'Profile', key: 'profileedit', storySets: profileStorySets
                }
            ]}
        ],
        featureSections: [
            {label: 'Profile', key: 'profile', pages: [
                {label: 'Edit Profile', key: 'profileedit', screen: ProfileEditFeatureDemo},
            ]}
        ]
    }
}

function profileStorySets() {return [
    {
        label: 'Profile Module Holder', 
        instanceKey: 'a', personaKey: 'a',
        modulePublic: {profile: {pseudonym: {takenname: 'b'}}},
        firebaseUser: {displayName: 'Alice Adams', photoURL: 'https://psi.newpublic.org/faces/face9.jpeg'},
        content: <ProfileModuleHolder module={ProfilePhotoAndNameFeature.config.profileModules[0]} />,
        serverCall: {profile: {update: () => {}}},
        stories: [
            {label: 'Good Pseudonym', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'malice'), CLICK('Save')
            ]},
            {label: 'Invalid', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'XXX'), CLICK('Save')
            ]},
            {label: 'Taken', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'takenname'), CLICK('Save')
            ]},
            {label: 'Back to full', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'malice'), CLICK('Save'),
                CLICK('Edit {tLabel}'), CLICK('Alice Adams'), 
                CLICK('Save'),
            ]},
            {label: 'Cancel', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'malice'), CLICK('Cancel')
            ]},

        ]
    }
]}

function ProfileEditFeatureDemo() {
    return <StructureDemo structureKey='profile' 
        globals={{initialized: true}}
        features={{profileedit: true}} instanceKey='a' 
    />   
}