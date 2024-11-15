import { CLICK, INPUT } from "../system/demo"
import { StructureDemo } from "../util/instance"
import { ProfileModuleHolder } from "../structure/profile"
import { FirstLoginSetupTester, ProfilePhotoAndNameFeature } from "../feature/ProfilePhotoAndName"
import { UnauthenticatedLoginScreen } from "../structure/login";

export const ProfileEditDemo = {
    key: 'demo_profileedit',
    name: 'Phote & Name Demo',
    config: {
        componentSections: [
            {label: 'Profile Feature Modules', key: 'profile', pages: [
                {
                    designUrl: 'https://www.figma.com/design/iP7DEaY8SVqQcEGN6Feipj/Basic-Profile-%2B-Privacy-Settings?node-id=188-1054&m=dev', 
                    label: 'Photo & Name', key: 'profileedit', storySets: profileStorySets
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
        serverCall: {profile: {
            update: ({datastore, updates, preview}) => {
                datastore.updateGlobalProperty('fields', updates);
                datastore.updateObject('persona', 'a', preview);
            },
            checkName: ({name}) => ({violates: name == 'meanword', looksreal: name == 'joebiden'}),
        }},
        stories: [
            {label: 'Good Pseudonym', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'malice'), CLICK('Save')
            ]},
            {label: 'Invalid', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'XXX'), CLICK('Save')
            ]},
            {label: 'Violating', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'meanword'), CLICK('Save')
            ]},
            {label: 'Looks real', actions: [
                CLICK('Edit {tLabel}'), CLICK('A pseudonym'), 
                INPUT('pseudonym', 'joebiden'), CLICK('Save')
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
            {label: 'Letter Pic', actions: [
                CLICK('Edit {tLabel}'), CLICK('letter'),
                CLICK('Save'),
            ]},
            {label: 'Back to Photo', actions: [
                CLICK('Edit {tLabel}'), CLICK('letter'),
                CLICK('Save'),
                CLICK('Edit {tLabel}'), CLICK('photo'),
                CLICK('Save'),
            ]},
            {label: 'Photo and Pseudonym', actions: [
                CLICK('Edit {tLabel}'), CLICK('letter'),
                CLICK('A pseudonym'), INPUT('pseudonym', 'malice'), 
                CLICK('Save'),
            ]},
        ]
    },
    {
        label: 'Other User Profile', 
        instanceKey: 'b', personaKey: 'a',
        content: <ProfileModuleHolder module={ProfilePhotoAndNameFeature.config.profileModules[0]} />,
    },
]}

function ProfileEditFeatureDemo() {
    return <StructureDemo structureKey='profile' 
        globals={{initialized: true}}
        features={{profileedit: true}} instanceKey='a' 
    />   
}