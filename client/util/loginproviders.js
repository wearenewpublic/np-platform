
export const githubLogin = {
    clientId: 'Ov23liYVNTv1E8unqe4c',
    authUrl: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
    extraParams: {response_type: 'code'},
    mode: 'code',
    name: 'Github',
    key: 'github',
    icon: 'github.png',
    silos: ['global', 'demo'],
}

export const rcIntLogin = {
    key: 'rcInt',
    clientId: '77d1b085-1c39-4f0e-b6ce-92acaf992295',
    authUrl: 'https://int-login.cbc.radio-canada.ca/0aa1e8c2-5242-47a4-996a-6ed694ee7127/B2C_1A_ExternalClient_FrontEnd_Login/oauth2/v2.0/authorize',
    extraParams: {
        response_type: 'id_token',
        response_mode: 'fragment',
        redirect_uri: 'https://psi.newpublic.org/global/login/one/fragmentRedirect',
        scope: 'openid https://rcmnb2cint.onmicrosoft.com/1d0b826c-646a-472a-9d3a-fdf4441895e9/email https://rcmnb2cint.onmicrosoft.com/1d0b826c-646a-472a-9d3a-fdf4441895e9/profile',
        ui_locales: 'fr'
    },
    mode: 'fragment',
    name: 'Radio Canada Internal',
    silos: ['global', 'demo', 'test'],
    icon: 'rc.svg'
}

export const rcLogin = {
    clientId: '32c46880-ae6e-429c-a437-97bab2c26f86',
    authUrl: 'https://login.cbc.radio-canada.ca/bef1b538-1950-4283-9b27-b096cbc18070/B2C_1A_ExternalClient_FrontEnd_Login/oauth2/v2.0/authorize',
    scope: 'User.Read',
    extraParams: {response_type:'id_token', response_mode: 'fragment', ui_locales: 'fr'},
    mode: 'fragment',
    name: 'Radio Canada',
    key: 'rc',
    icon: 'rc.svg',
    silos: ['global', 'demo', 'test'],
}

