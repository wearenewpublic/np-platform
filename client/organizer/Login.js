import React from 'react';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, auth, getFirebaseUser } from '../util/firebase';
import { goBack, pushSubscreen } from '../util/navigate';
import { Center, Clickable, Pad, PadBox } from '../component/basics';
import { Image, View } from 'react-native';
import { usePersonaKey } from '../util/datastore';
import { Heading } from '../component/text';
import { RichText } from '../component/richtext';
import { colorLightGreen, colorTextGrey } from '../component/color';
import { CTAButton } from '../component/button';
import { expandUrl } from '../util/util';


export function LoginScreen({action}) {
    async function handleGoogleSignIn() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
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
        <CTAButton image={
            <Image 
                source={{uri: expandUrl({url: 'google.png', type: 'images'})}} 
                style={{width: 20, height: 20}} />} 
                type='secondary' label='Continue with Google' onPress={handleGoogleSignIn} />
        {/* <Clickable onPress={handleGoogleSignIn}>
            <Image source={require('../assets/google_signin.png')} style={{width: 200, height: 50}} />
        </Clickable> */}
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
