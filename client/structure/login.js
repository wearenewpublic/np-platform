import React from 'react';
import { useState } from 'react';
import { signInWithGoogle, getFirebaseDataAsync, signInWithTokenAsync } from '../util/firebase';
import { LoadingScreen, Narrow, Pad, PadBox } from '../component/basics';
import { Image, StyleSheet, View } from 'react-native';
import { useDatastore, usePersonaKey, useSiloKey } from '../util/datastore';
import { Heading, UtilityText } from '../component/text';
import { RichText } from '../component/richtext';
import { colorPinkBackground, colorTealBackground, colorWhite, colorBlack, colorBlackHover } from '../component/color';
import { CTAButton } from '../component/button';
import { assembleUrl, makeAssetUrl, makeRandomNonce } from '../util/util';
import { logEventAsync, useLogEvent } from '../util/eventlog';
import { FirstLoginSetup } from '../feature/ProfilePhotoAndName';
import { useEffect } from 'react';
import { getIsLocalhost } from '../util/url';
import { BannerMessage } from '../component/banner';

export const LoginStructure = {
    key: 'login',
    name: 'Login',
    screen: LoginScreen,   
    subscreens: {
        tokenRedirect: TokenRedirectScreen,
        fragmentRedirect: FragmentRedirectScreen,
        fragmentredirect: <UtilityText label='BUG: Lowercase URL transform'/>,
    }
}


export function LoginScreen({ action }) {
    useLogEvent('login-screen', { action });
    const datastore = useDatastore();
    const personaKey = usePersonaKey();

    const [inProgress, setInProgress] = React.useState(false);
    const [needsSetup, setNeedsSetup] = React.useState(false);

    async function handleUserLoggedIn(personaKey) {
        setInProgress(true);
        const personaPreview = await getFirebaseDataAsync([
            'silo', datastore.getSiloKey(), 'structure', 'profile',
            'instance', personaKey, 'global', 'preview']);
        if (!personaPreview?.name) {
            setInProgress(false);
            setNeedsSetup(true);
        } else {
            datastore.goBack();
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
        datastore.goBack();
    }

    if (inProgress) {
        return <LoadingScreen label='Logging in...' />
    } else if (needsSetup) {
        return <Narrow><Pad size={20}/><FirstLoginSetup onFieldsChosen={onFieldsChosen} /></Narrow>
    } else {
        return <UnauthenticatedLoginScreen action={action} />;
    }
};

export function UnauthenticatedLoginScreen({action, showGithub=true, showGoogle=true}) {
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
            {showGoogle && <GoogleLogin />}
            {loginProviders.map(loginProvider => 
                <SSOLogin key={loginProvider.key} loginProvider={loginProvider} />
            )}
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
    loginButtonsWrapper: {
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


var loginProviders = [];
export function registerLoginProviders(providers) {
    loginProviders = [...loginProviders, ...providers];
}


function GoogleLogin() {
    const datastore = useDatastore();

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

    return <PadBox><CTAButton
        icon={<LoginProviderIcon providerIcon='google.png' />}
        label='Continue with Google' color={colorBlack} onPress={handleGoogleSignIn} 
    /></PadBox>
}

// TODO: Actually check the nonce on the callback
export function SSOLogin({loginProvider}) {
    const datastore = useDatastore();
    const siloKey = useSiloKey();
    if (!loginProvider.silos.includes(siloKey)) {
        return null;
    }

    function onLogin() {
        logEventAsync(datastore, 'login-request', { method: loginProvider.key });

        const codeCallbackUrl = 'https://psi.newpublic.org/api/auth/callback'
        const fragmentRedirectUrl = 'https://psi.newpublic.org/' + siloKey + '/login/one/fragmentRedirect';
        const redirect_uri = loginProvider.mode == 'code' ? codeCallbackUrl : fragmentRedirectUrl;
        const nonce = makeRandomNonce();

        const loginUrl = assembleUrl(loginProvider.authUrl, { 
            state: JSON.stringify({ 
                siloKey: datastore.getSiloKey(), 
                provider: loginProvider.key,
                debug: getIsLocalhost(),
            }),
            nonce,
            client_id: loginProvider.clientId,
            redirect_uri,
            scope: loginProvider.scope,
            ... loginProvider.extraParams
        });

        datastore.openUrl(loginUrl, 'Login with ' + loginProvider.name, 'width=600,height=600');
    }

    return <PadBox top={20}>
        <CTAButton type='secondary' onPress={onLogin} 
            icon={<LoginProviderIcon providerIcon={loginProvider.icon} />}
            label={'Continue with ' + loginProvider.name}
        />
    </PadBox>            
}

export function TokenRedirectScreen({ token, provider, email }) {
    const datastore = useDatastore();
    async function handleToken() {
        await signInWithTokenAsync(token);
        logEventAsync(datastore, 'login-success', { provider, email });

        datastore.closeWindow();
    }
    useEffect(() => {
        handleToken(token);
    }, [token]);
    return <UtilityText label='Logging in...' />
}

function getFragmentParams(fragment) {
    const fragmentContent = fragment.startsWith('#') ? fragment.substring(1) : fragment;
    const params = new URLSearchParams(fragmentContent);
    return Object.fromEntries(params.entries());
}

export function FragmentRedirectScreen() {
    const datastore = useDatastore();
    const fragment = datastore.getUrlFragment();

    async function loginWithTokenFragment() {
        const fragmentParams = getFragmentParams(fragment);
        const ssoToken = fragmentParams.id_token;
        const state = JSON.parse(fragmentParams.state);
        const provider = state.provider;
        const {loginToken} = await datastore.callServerAsync('auth', 'convertToken', { ssoToken, provider });
        await datastore.signInWithTokenAsync(loginToken);
        if (state.siloKey != 'test') {
            datastore.closeWindow();
        }
    }

    useEffect(() => {
        loginWithTokenFragment();
    }, [fragment])

    return <BannerMessage label='Logging in...'/>
}

function LoginProviderIcon({providerIcon}) {
    return <Image source={{ uri: makeAssetUrl(`images/${providerIcon}`) }} style={{ width: 20, height: 20 }} />
}

