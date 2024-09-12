const axios = require('axios');
const { getOrCreateUserAsync, createLoginToken } = require("../util/firebaseutil");

const github_client_id = 'Ov23liYVNTv1E8unqe4c'
const oauth_callback_url = 'https://psi.newpublic.org/api/auth/callback'
const github_auth_url = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&redirect_uri=${oauth_callback_url}&scope=read:user%20user:email&response_type=code`
const github_access_url = 'https://github.com/login/oauth/access_token'
const github_user_url = 'https://api.github.com/user'

var global_github_client_secret = null;
function setGithubClientSecret(secret) {
    global_github_client_secret = secret;
}
exports.setGithubClientSecret = setGithubClientSecret;

async function authCallbackAsync({code, state}) {
    console.log('authCallback', code, state);
    const parsedState = JSON.parse(state ?? '{}');
    console.log('parsedState', parsedState);
    const response = await axios.post(github_access_url, {
        client_id: github_client_id,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: oauth_callback_url
    },{
        headers: {
            Accept: 'application/json'
        }
    });
    console.log('response.data', response.data);  
    const accessToken = response.data.access_token;
    console.log('Access Token:', accessToken); 
    const userInfo = await getUserInfoAsync(accessToken);
    console.log('userInfo', userInfo);
    console.log('key properties', {
        email: userInfo.email, name: userInfo.name, 
        location: userInfo.location ?? null, bio: userInfo.bio ?? null,
        photoUrl: userInfo.picture ?? userInfo.avatar_url ?? null
    });
    const name = getNameFromUserInfo(userInfo);
    const userRecord = await getOrCreateUserAsync({
        email: userInfo.email, name, 
        photoUrl: userInfo.picture ?? userInfo.avatar_url ?? null
    });
    const loginToken = await createLoginToken(userRecord.uid);
    const siloKey = parsedState.siloKey;
    const encodedEmail = encodeURIComponent(userInfo.email);
    const redirect = `https://psi.newpublic.org/${siloKey}/login/one/tokenRedirect?token1=${loginToken}&email=${encodedEmail}&provider=github`;
    console.log('Redirecting to:', redirect);
    return {redirect: redirect};
}

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

async function getUserInfoAsync(accessToken) {
    const response = await axios.get(github_user_url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
        }
    });
    const userInfo = response.data;
    console.log('User Info:', userInfo);
    return userInfo;
}

exports.publicFunctions = {
    callback: authCallbackAsync
}