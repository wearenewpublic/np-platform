import React from 'react';
import { useState } from 'react';
import { getFirebaseUser, signInWithGoogle, getFirebaseDataAsync, signInWithToken, signInWithTokenAsync } from '../util/firebase';
import { goBack, gotoInstance, pushSubscreen } from '../util/navigate';
import { LoadingScreen, Narrow, Pad, PadBox } from '../component/basics';
import { Image, StyleSheet, View } from 'react-native';
import { useDatastore, usePersonaKey } from '../util/datastore';
import { Heading, UtilityText } from '../component/text';
import { RichText } from '../component/richtext';
import { colorTextGrey, colorPinkBackground, colorTealBackground, colorWhite, colorBlack, colorBlackHover } from '../component/color';
import { CTAButton } from '../component/button';
import { makeAssetUrl } from '../util/util';
import { logEventAsync, useLogEvent } from '../util/eventlog';
import { FirstLoginSetup } from '../feature/ProfilePhotoAndName';
import { useEffect } from 'react';

export const LoginStructure = {
    key: 'login',
    name: 'Login',
    screen: LoginScreen,   
    subscreens: {
        tokenRedirect: TokenRedirectScreen,
        dummyLogin: DummyLoginScreen,
    }
}


export function LoginScreen({ action }) {
    useLogEvent('login-screen', { action });
    const datastore = useDatastore();
    const personaKey = usePersonaKey();

    const [inProgress, setInProgress] = React.useState(false);
    const [needsSetup, setNeedsSetup] = React.useState(false);
    async function handleGoogleSignIn() {
        logEventAsync(datastore, 'login-request', { method: 'google' });
        try {
            const result = await signInWithGoogle();
            logEventAsync(datastore, 'login-success', {
                method: 'google',
                email: result?.user?.email ?? 'unknown',
            });
        } catch (error) {
            console.error(error);
        }
    };

    async function handleUserLoggedIn(personaKey) {
        setInProgress(true);
        const personaPreview = await getFirebaseDataAsync([
            'silo', datastore.getSiloKey(), 'structure', 'profile',
            'instance', personaKey, 'global', 'preview']);
        if (!personaPreview?.name) {
            setInProgress(false);
            setNeedsSetup(true);
        } else {
            goBack();
        }
    }

    useEffect(() => {
        if (personaKey) {
            handleUserLoggedIn(personaKey);
        }
    }, [personaKey]);

    async function onFieldsChosen({updates, preview}) {
        setInProgress(true);
        await datastore.callServerAsync('profile', 'update', {
            updates, preview,
            structureKey: 'profile',
            instanceKey: datastore.getPersonaKey(),
        });
        setInProgress(false);
        logEventAsync(datastore, 'profile-setup', preview);
        goBack();
    }

    if (inProgress) {
        return <LoadingScreen label='Logging in...' />
    } else if (needsSetup) {
        return <Narrow><Pad size={20}/><FirstLoginSetup onFieldsChosen={onFieldsChosen} /></Narrow>
    } else {
        return <UnauthenticatedLoginScreen action={action} onPress={handleGoogleSignIn} />;
    }
};

export function UnauthenticatedLoginScreen({action, onPress, showGithub=true}) {
    const s = UnauthenticatedLoginScreenStyle;
    const [bubbleHeight, setBubbleHeight] = useState(0);
    return <View style={s.outer}>
        <Pad size={40} />        
        <Heading level='1' center label={'Join the conversation' + (action ? ' to ' + action : '')} />
        <Pad size={4}/>
        <View style={s.subHeadWrapper}>
            <Heading level='5' center label={"Once you log in, you can use a different display name if you prefer to not reveal your real name"} />
        </View>
        <Pad size={52} />
        <View style={s.imageWrapper}>
            <View style={[s.bubble, { top: -(bubbleHeight / 2) }]}
            onLayout={(event) => setBubbleHeight(event.nativeEvent.layout.height)}>
                <PadBox>
                <Heading level='3' center color={colorWhite} label={'Set your visibility after log in'} />
                </PadBox>
            </View> 
            <Image source={{ uri: makeAssetUrl("images/set_visibility_image.png") }} style={{ width: 250, height: 160 }} />
        </View>
        <Pad size={32} />
        <View style={s.loginButtonsWrapper}>
            <CTAButton
                icon={<LoginProviderIcon providerName='google' />}
                label='Continue with Google' color={colorBlack} onPress={onPress} />
            {showGithub && <GitHubLogin />}
        </View>
        <Pad size={32} />
        <View style={s.footer}>
            <RichText color={colorBlackHover} style={{textAlign: 'center'}} label='By continuing, you agree to our [community guidelines](https://example.com) and [Privacy Policy](https://example.com).' />
        </View>
        <Pad />
    </View>
}

const UnauthenticatedLoginScreenStyle = StyleSheet.create({
    outer: {
        backgroundColor: colorPinkBackground,
        flex: 1,
        alignItems: 'center',
    },
    subHeadWrapper: {
        maxWidth: 400,
        minWidth: 330,  
    },
    imageWrapper: {
        position: 'relative',
        alignItems: 'center',
    },
    bubble: {
        position: 'absolute',
        maxWidth: 210,
        minHeight: 30,
        borderRadius: 32,
        backgroundColor: colorTealBackground,
        top: -20,
        zIndex: 1,
        borderColor: colorPinkBackground,
        borderWidth: 1.5,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        maxWidth: 400,
        minWidth: 375,
    }
});

function GitHubLogin() {
    const datastore = useDatastore();
    const siloKey = datastore.getSiloKey();

    function onPress() {
        logEventAsync(datastore, 'login-request', { method: 'github' });

        const state = encodeURIComponent(JSON.stringify({ siloKey, provider: 'github' }));
        const github_client_id = 'Ov23liYVNTv1E8unqe4c'
        const oauth_callback_url = 'https://psi.newpublic.org/api/auth/callback'
        const github_auth_url = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&redirect_uri=${oauth_callback_url}&state=${state}&scope=read:user%20user:email&response_type=code`;

        const popup = window.open(github_auth_url, 'Login with Github', 'width=600,height=600');

        console.log('login with github');
    }

    if (siloKey != 'demo') {
        return null;
    }

    return <PadBox top={20}>
        <CTAButton type='secondary' onPress={onPress} 
            icon={<LoginProviderIcon providerName='github' />}
            label='Continue with GitHub' 
        />
    </PadBox>            
}

function TokenRedirectScreen({ token, provider, email }) {
    const datastore = useDatastore();
    async function handleToken() {
        console.log('TokenRedirectScreen', { token });
        await signInWithTokenAsync(token);
        logEventAsync(datastore, 'login-success', { provider, email });

        window.close();
    }
    useEffect(() => {
        handleToken(token);
    }, [token]);
    return <UtilityText label='Logging in...' />
}

function DummyLoginScreen() {
    useEffect(() => {
        window.close();
    });
    return <UtilityText label='Dummy logging in...' />
}

function LoginProviderIcon({providerName}) {
    return <Image source={{ uri: makeAssetUrl(`images/${providerName}.png`) }} style={{ width: 20, height: 20 }} />
}

export function needsLogin(callback, action) {
    return () => {
        const user = getFirebaseUser();

        if (!user) {
            // pushSubscreen('login', { action });
            gotoInstance({structureKey: 'login', instanceKey: 'one', params: {action}});
        } else {
            return callback();
        }
    }
}

