import React from 'react';
import { Text } from 'react-native';
import { useLiveUrl } from './util/url';
import { getScreenStackForUrl, gotoInstance } from './util/navigate';
import { ScreenStack, useStandardFonts } from './util/instance';
import { setFirebaseConfig } from './util/firebase';
import { extendRoles } from './component/admin';
import { registerLoginProviders } from './structure/login';

const firebaseConfig = {
    apiKey: "AIzaSyDIg3OR3i51VYrUyUd_L5iIownjdSnExlc",
    authDomain: "np-psi-dev.firebaseapp.com",
    databaseURL: "https://np-psi-dev-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "np-psi-dev",
    storageBucket: "np-psi-dev.appspot.com",
    messagingSenderId: "768032889623",
    appId: "1:768032889623:web:634a1604eda03820ab7552"
};

const githubLogin = {
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

const rcLogin = {
    clientId: '32c46880-ae6e-429c-a437-97bab2c26f86',
    authUrl: 'https://login.cbc.radio-canada.ca/bef1b538-1950-4283-9b27-b096cbc18070/B2C_1A_ExternalClient_FrontEnd_Login/oauth2/v2.0/authorize',
    scope: 'User.Read',
    extraParams: {response_type:'id_token', response_mode: 'fragment', ui_locales: 'fr'},
    mode: 'fragment',
    name: 'Radio Canada',
    key: 'rc',
    icon: 'rc.svg',
    silos: ['global', 'demo', 'rc']
}

registerLoginProviders([githubLogin, rcLogin])

// const app = initializeApp(firebaseConfig);
setFirebaseConfig(firebaseConfig);
extendRoles({});

export default function App() {
    useStandardFonts();
    const url = useLiveUrl();
    const {siloKey, structureKey, instanceKey, screenStack} = getScreenStackForUrl(url);

    if (!structureKey) {
        gotoInstance({structureKey: 'componentdemo', instanceKey: 'demo'});
        return null;
    } else if (structureKey && instanceKey) {
        return <ScreenStack url={url} screenStack={screenStack} siloKey={siloKey} structureKey={structureKey} instanceKey={instanceKey} />
    } else {
        return <Text>You need a valid space URL to see a space</Text>
    }
}

