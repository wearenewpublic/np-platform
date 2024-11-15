const axios = require('axios');
const { getOrCreateUserAsync, createLoginToken } = require("../util/firebaseutil");
const jwt = require('jsonwebtoken');

const github_client_id = 'Ov23liYVNTv1E8unqe4c'
const oauth_callback_url = 'https://psi.newpublic.org/api/auth/callback'
const github_auth_url = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&redirect_uri=${oauth_callback_url}&scope=read:user%20user:email&response_type=code`
const github_access_url = 'https://github.com/login/oauth/access_token'
const github_user_url = 'https://api.github.com/user'
const github_user_emails = 'https://api.github.com/user/emails'

var global_github_client_secret = null;
function setGithubClientSecret(secret) {
    global_github_client_secret = secret;
}
exports.setGithubClientSecret = setGithubClientSecret;

async function authCallbackAsync({code, state}) {
    const parsedState = JSON.parse(state ?? '{}');
    const response = await axios.post(github_access_url, {
        client_id: github_client_id,
        client_secret: global_github_client_secret,
        code: code,
        redirect_uri: oauth_callback_url
    },{
        headers: {
            Accept: 'application/json'
        }
    });
    if (response.data.error) {
        throw new Error('Error getting access token: ' + response.data.error);
    }
    const accessToken = response.data.access_token;
    const userInfo = await getUserInfoAsync(accessToken);
    const email = await getUserPrimaryEmailAsync(accessToken);
    const name = getNameFromUserInfo(userInfo);
    const userRecord = await getOrCreateUserAsync({
        email, name, 
        photoUrl: userInfo.picture ?? userInfo.avatar_url ?? null
    });
    const loginToken = await createLoginToken(userRecord.uid);
    const siloKey = parsedState.siloKey;
    const encodedEmail = encodeURIComponent(userInfo.email);
    const redirect = `https://psi.newpublic.org/${siloKey}/login/one/tokenRedirect?token1=${loginToken}&email=${encodedEmail}&provider=github`;
    return {redirect: redirect};
}
exports.authCallbackAsync = authCallbackAsync;

function getNameFromUserInfo(userInfo) {
    if (userInfo.full_name) {
        return userInfo.full_name;
    } else if (userInfo.given_name && userInfo.family_name) {
        return userInfo.given_name + ' ' + userInfo.family_name;
    } else if (userInfo.name) {
        return userInfo.name;
    } else {
        throw new Error('No name found in user info');
    }
}
exports.getNameFromUserInfo = getNameFromUserInfo;

async function getUserInfoAsync(accessToken) {
    const response = await axios.get(github_user_url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
        }
    });
    const userInfo = response.data;
    return userInfo;
}
exports.getUserInfoAsync = getUserInfoAsync;

async function getUserPrimaryEmailAsync(accessToken) {
    const response = await axios.get(github_user_emails, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
        }
    });
    const emails = response.data;

    const primaryEmail = emails.find(email => email.primary && email.verified);
    if (!primaryEmail) {
        throw new Error('No verified primary verified email found in user emails');
    }
    return primaryEmail.email;
}
exports.getUserPrimaryEmailAsync = getUserPrimaryEmailAsync;

function parseJWT(token) {
    // Split the token into its three parts
    const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');

    // Decode each part from Base64 URL encoding
    const header = JSON.parse(atob(headerEncoded.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/')));
    const signature = atob(signatureEncoded.replace(/-/g, '+').replace(/_/g, '/'));

    return { header, payload, signature };
}
var global_ssoProviderKeyUrl = {};
function addProviderKeyUrls(providerKeyUrls) {
    global_ssoProviderKeyUrl = {...global_ssoProviderKeyUrl, ...providerKeyUrls};
}
exports.addProviderKeyUrls = addProviderKeyUrls;

async function getKeysForProviderAsync(provider) {
    const keyUrl = global_ssoProviderKeyUrl[provider];
    if (!keyUrl) {
        throw new Error('No key URL found for provider: ' + provider);
    }
    const response = await axios.get(keyUrl);
    return response.data.keys;
}

async function convertTokenAsync({ssoToken, provider}) {
    const {header, payload, signature} = parseJWT(ssoToken);

    const publicKeys = await getKeysForProviderAsync(provider);
    const key = publicKeys.find(key => key.kid === header.kid);
    if (!key) {
        throw new Error('No key found for kid: ' + header.kid);
    }
    const x5cKey = key.x5c[0];
    const pemKey = `-----BEGIN CERTIFICATE-----\n${x5cKey}\n-----END CERTIFICATE-----`;
    const verified = jwt.verify(ssoToken, pemKey, {algorithms: ['RS256']});
    const userRecord = await getOrCreateUserAsync({
        email: verified.email, name: verified.name, 
        photoUrl: verified.picture ?? verified.avatar_url ?? undefined
    });
    console.log('User data', verified.name, verified.email);
    const loginToken = await createLoginToken(userRecord.uid);
    console.log('Created login token', loginToken);

    return {loginToken}
}

exports.publicFunctions = {
    callback: authCallbackAsync,
    convertToken: convertTokenAsync
}
