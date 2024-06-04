import React from 'react';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, auth, getFirebaseUser } from '../util/firebase';
import { goBack, pushSubscreen } from '../util/navigate';
import { Pad, PadBox } from '../component/basics';
import { Image, View } from 'react-native';
import { useDatastore, usePersonaKey } from '../util/datastore';
import { Heading } from '../component/text';
import { RichText } from '../component/richtext';
import { colorLightGreen, colorTextGrey } from '../component/color';
import { CTAButton } from '../component/button';
import { expandUrl } from '../util/util';
import { logEventAsync, useLogEvent } from '../util/eventlog';


export function LoginScreen({action}) {
    useLogEvent('login-screen', {action});
    const datastore = useDatastore();
    async function handleGoogleSignIn() {
        logEventAsync(datastore, 'login-request', {method: 'google'});
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            logEventAsync(datastore, 'login-success', {method: 'google'});
            goBack();
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <PadBox horiz={20} vert={20}>
        <Heading level='1' label={'Log in' + (action ? ' to ' + action : '')} />
        <Pad/>
        <RichText color={colorTextGrey} label='By continuing, you agree to our [community guidelines](https://example.com) and [Privacy Policy](https://example.com).' />
        <Pad size={40} />
        <CTAButton 
            icon={
                <Image source={{uri: expandUrl({url: 'google.png', type: 'images'})}} 
                    style={{width: 20, height: 20}} />
            } 
            type='secondary' label='Continue with Google' onPress={handleGoogleSignIn} />
    </PadBox>
  );
};

export function needsLogin(callback, action) {    
    return () => {
        const user = getFirebaseUser();

        if (!user) {
            pushSubscreen('login', {action});
        } else {
            return callback();
        }
    }
}
