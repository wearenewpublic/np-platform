import { FirstLoginSetupTester } from "../feature/ProfilePhotoAndName"
import { LoginScreen, UnauthenticatedLoginScreen } from "../structure/login"
import { CLICK, INPUT } from "../system/demo"

export const LoginDemo = {
    key: 'demo_login',
    name: 'Login Demo',
    config: {
        componentSections: [
            {label: 'Core Design System', key: 'core', pages: [
                {label: 'Login', key: 'login', storySets: loginStorySets}
            ]}
        ]
    }
}

function loginStorySets() {return [
    {
        label: 'Unauthenticated Login Screen',
        content: <UnauthenticatedLoginScreen showGithub />,
    },    
    {
        label: 'Show profile setup if needed',
        content: <LoginScreen />,
        serverCall: {profile: {
            checkName: ({name}) => ({violates: name == 'meanword'}),
            update: () => {}
        }},
        stories: [
            {label: 'Just Continue', actions: [
                CLICK('Finish')
            ]},
            {label: 'Letter Photo', actions: [
                CLICK('letter'), CLICK('Finish')
            ]},
            {label: 'Good Pseudonym', actions: [
                CLICK('A pseudonym'), 
                INPUT('pseudonym', 'malice'), CLICK('Finish')
            ]},
            {label: 'Bad Pseudonym', actions: [
                CLICK('A pseudonym'), 
                INPUT('pseudonym', 'meanword'), CLICK('Finish')
            ]},
        ]
    },
]}
