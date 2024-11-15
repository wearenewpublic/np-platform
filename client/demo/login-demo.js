import { FirstLoginSetupTester } from "../feature/ProfilePhotoAndName"
import { FragmentRedirectScreen, LoginScreen, SSOLogin, UnauthenticatedLoginScreen } from "../structure/login"
import { CLICK, INPUT } from "../system/demo"
import { signInWithTokenAsync } from "../util/firebase"
import { rcIntLogin } from "../util/loginproviders"

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
        stories: [
            {label: 'Continue with RC Internal', actions: [
               CLICK('Continue with Radio Canada Internal')
            ]},
            {label: 'Continue with Github', actions: [
                CLICK('Continue with Github')
             ]},
        ]
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
    {
        label: 'Fragment Redirect Screen',
        urlFragment: '#state=%7b%22siloKey%22%3a%22global%22%2c%22provider%22%3a%22rcInt%22%2c%22debug%22%3atrue%7d&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IkNBMkM3QzJFQjlEMkE1MkE1QTJEMzdDQzBFRTczMjI1QzcwM0ZBMDYiLCJ4NXQiOiJ5aXg4THJuU3BTcGFMVGZNRHVjeUpjY0QtZ1kiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MzAzMzIwOTUsIm5iZiI6MTczMDMxMDQ5NSwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9pbnQtbG9naW4uY2JjLnJhZGlvLWNhbmFkYS5jYS8wYWExZThjMi01MjQyLTQ3YTQtOTk2YS02ZWQ2OTRlZTcxMjcvdjIuMC8iLCJzdWIiOiJkMDFjZGUzNi00MjJkLTRkYjAtOTVhMS1hNDMzYzVhOTJiNjAiLCJhdWQiOiI3N2QxYjA4NS0xYzM5LTRmMGUtYjZjZS05MmFjYWY5OTIyOTUiLCJhY3IiOiJiMmNfMWFfZXh0ZXJuYWxjbGllbnRfZnJvbnRlbmRfbG9naW4iLCJub25jZSI6IjM4NGdrc3d0MHNlYW92MXJtNHVsdSIsImlhdCI6MTczMDMxMDQ5NSwiYXV0aF90aW1lIjoxNzMwMzEwNDk1LCJhenBDb250ZXh0IjoiaWNpY2EiLCJvaWQiOiIwNmQ1ZTlhZi0wYWU5LTQ0ZmUtYWZlMC01OWNlYTFlY2ZjNWUiLCJlbWFpbCI6InJvYkBuZXdwdWJsaWMub3JnIiwicmNpZCI6ImQwMWNkZTM2LTQyMmQtNGRiMC05NWExLWE0MzNjNWE5MmI2MCIsImdpdmVuX25hbWUiOiJSb2IiLCJmYW1pbHlfbmFtZSI6IkVubmFscyIsIm5hbWUiOiJSb2IgRW5uYWxzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlkcFVzZXJJZCI6ImQxNTBiMWE2OWE4MjQ2Yzk4YThlNDgwMDM4ODA1ZjkyIiwibHJhdCI6IjY3MjE2MGNmLWZlMWYtNGIxMy1hYzZhLTM1Y2YwYWVlMDIwMCIsImF1dGhfZnJvbV9zZXNzaW9uIjp0cnVlLCJpZHAiOiJyYWRpb2NhbmFkYSIsImp0aSI6IjBhYTFlOGMyLTUyNDItNDdhNC05OTZhLTZlZDY5NGVlNzEyN18zNjBmODIzMi1lMDM4LTRhMjYtYTkyOS1hZjRiZDU1ZDdiNjIifQ.V9E0TmX_wY8R57YdHABmJAU9T8d3PEWUdAcjHDO73Owbd9H21pocJaEk--HX6MF9NpPwyJKV8C4yXNUkfOdi--qmVpKJVjBreerVvDhd-8FFTykP3EurVpFE5kgmW-LjIXOIVIyHtnNu53Uxq-vaJufAQlAf0tAnE4h1cVSF-ycs2iSeTqT_zH-DXlkKWrOOfZXzztjKwAP7UN9AINo2eMf9iTS0FYsdgyNnniL6t5wKI9PyRcweZaQl4AFv5gJxv0NCs7DSGp8audfNiQcR4Pycu2nQGP7bSvnQT1scf2-W6SxpOCQA6wL0KHxcGkTiqxQ9ttNj6uzAmtvmXEzgoQ',
        content: <FragmentRedirectScreen />,
        serverCall: {
            auth: {convertToken: () => ({loginToken: 'firebase-token'})},
            local: {signInWithToken: () => {}}
        }
    }
]}
