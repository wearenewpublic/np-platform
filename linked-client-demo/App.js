import React from 'react';
import { Text } from 'react-native';
import { useLiveUrl } from './util/url';
import { getScreenStackForUrl, gotoInstance } from './util/navigate';
import { ScreenStack, useStandardFonts } from './util/instance';
import { setFirebaseConfig } from './util/firebase';
import { extendRoles } from './component/admin';
import { registerLoginProviders } from './structure/login';
import { githubLogin, rcLogin, rcIntLogin } from './util/loginproviders';

const firebaseConfig = {
    apiKey: "AIzaSyDIg3OR3i51VYrUyUd_L5iIownjdSnExlc",
    authDomain: "np-psi-dev.firebaseapp.com",
    databaseURL: "https://np-psi-dev-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "np-psi-dev",
    storageBucket: "np-psi-dev.appspot.com",
    messagingSenderId: "768032889623",
    appId: "1:768032889623:web:634a1604eda03820ab7552"
};


registerLoginProviders([githubLogin, rcIntLogin])

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

