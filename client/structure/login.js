import React from 'react';
import { getFirebaseUser, signInWithGoogle, getFirebaseDataAsync, signInWithToken, signInWithTokenAsync } from '../util/firebase';
import { goBack, gotoInstance, pushSubscreen } from '../util/navigate';
import { LoadingScreen, Narrow, Pad, PadBox } from '../component/basics';
import { Image } from 'react-native';
import { useDatastore, usePersonaKey } from '../util/datastore';
import { Heading, UtilityText } from '../component/text';
import { RichText } from '../component/richtext';
import { colorTextGrey } from '../component/color';
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
        return (
            <PadBox horiz={20} vert={20}>
                <Heading level='1' label={'Log in' + (action ? ' to ' + action : '')} />
                <Pad />
                <RichText color={colorTextGrey} label='By continuing, you agree to our [community guidelines](https://example.com) and [Privacy Policy](https://example.com).' />
                <Pad size={40} />
                <CTAButton
                    icon={<LoginProviderIcon providerName='google' />}
                    type='secondary' label='Continue with Google' onPress={handleGoogleSignIn} />
                <GitHubLogin />
            </PadBox>
        );
    }
};

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

