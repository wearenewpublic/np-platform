const { getUserByEmail, createCustomToken } = require("../../util/testutil");
const { setFirebaseAdmin } = require("../../util/firebaseutil");
const { authCallbackAsync, getNameFromUserInfo, parseJWT, addProviderKeyUrls, getKeysForProviderAsync, convertTokenAsync } = require("../auth");
const { post, get } = require("axios");
const jwt = require('jsonwebtoken');


test('authCallbackAsync', async () => {
    post.mockResolvedValue({data: {access_token: 'accessToken'}});
    getUserByEmail.mockResolvedValueOnce({uid: 'userRob'});
    createCustomToken.mockResolvedValue('loginToken');
    get.mockResolvedValueOnce({data: {email: 'user@domain.com', name: 'Rob Zilla', picture: 'https://rob.com/rob.jpg'}});
    get.mockResolvedValueOnce({data: [{email: 'email', primary: true, verified: true}]});

    const state = {siloKey: 'demo', provider: 'github'};
    const result = await authCallbackAsync({code: 'code', state: JSON.stringify(state)});
    expect(result.redirect).toBe('https://psi.newpublic.org/demo/login/one/tokenRedirect?token1=loginToken&email=user%40domain.com&provider=github');
});

test('getNameFromUserInfo', () => {
    const userInfo = {name: 'Rob Zilla'};
    expect(getNameFromUserInfo({name: 'Rob Zilla'})).toBe('Rob Zilla');
    expect(getNameFromUserInfo({full_name: 'Rob Zilla'})).toBe('Rob Zilla');
    expect(() => getNameFromUserInfo({})).toThrow('No name found in user info');    
})

const JWT = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjkzQURGMUNFNDhGNENCQUVCOTBDM0YyNEU5RDc0QkU5RjU0REJDMTIiLCJ4NXQiOiJrNjN4emtqMHk2NjVERDhrNmRkTDZmVk52QkkiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MzE1NTM5NzksIm5iZiI6MTczMTUzMjM3OSwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5jYmMucmFkaW8tY2FuYWRhLmNhL2JlZjFiNTM4LTE5NTAtNDI4My05YjI3LWIwOTZjYmMxODA3MC92Mi4wLyIsInN1YiI6IjQ2YjBjOTUxLTY0NDYtNDFiZi04YmVkLTIzMTZlZTIxNzdiYSIsImF1ZCI6IjMyYzQ2ODgwLWFlNmUtNDI5Yy1hNDM3LTk3YmFiMmMyNmY4NiIsImFjciI6ImIyY18xYV9leHRlcm5hbGNsaWVudF9mcm9udGVuZF9sb2dpbiIsIm5vbmNlIjoieXYzcnViZWNpbXh5Y3pibDY1NjVoIiwiaWF0IjoxNzMxNTMyMzc5LCJhdXRoX3RpbWUiOjE3MzE1MzIzNzksImF6cENvbnRleHQiOiJpY2ljYSIsIm9pZCI6ImQ1ODc2YmY2LWE4NjUtNDI2NS05OTJjLTY5ODU3MTFmYTk5YyIsImVtYWlsIjoicm9iQG5ld3B1YmxpYy5vcmciLCJyY2lkIjoiNDZiMGM5NTEtNjQ0Ni00MWJmLThiZWQtMjMxNmVlMjE3N2JhIiwiZ2l2ZW5fbmFtZSI6IlJvYiIsImZhbWlseV9uYW1lIjoiRW5uYWxzIiwibmFtZSI6IlJvYiBFbm5hbHMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWRwVXNlcklkIjoiNTk2ZmUwNjM5NDIyNDI4YWJmZTEzOTU5OTE3Yzg1MjEiLCJscmF0IjoiNjczNTE2NTctZjQxZS00NjIxLTkzNzAtYTFlNTBiMGUwMjAyIiwiYXV0aF9mcm9tX3Nlc3Npb24iOnRydWUsImlkcCI6InJhZGlvY2FuYWRhIiwianRpIjoiYmVmMWI1MzgtMTk1MC00MjgzLTliMjctYjA5NmNiYzE4MDcwXzJjNjhkOTE0LWM2ZDctNDRlYS1iOTM3LWJiM2E0NTgzMmI0OCJ9.JpydORQB0vWSvZWS83W5p5mGxS2qFAH1GnQ1p8IFSvObHqYeZpfjp3QgWuaoTrUB8Ag_J0mcUAaGGTDh5NelULU3_bebyJjZZz8v46k7VaChDiW-D8Ktadcraozdvd9HMBqzOdxrHmUEUT0t8ubX4WYWnsUs-QhMEM8cavADh5i1wuypgX8TphhRU56zGpW_iwSkNlM8gX-ks1bUmaG-t8sOx14de_74C8t2xeBXBnJ8D83kzR0UEkIue9naFFsraO-838p4ZOm0rxfZrlBZVSCwWQoBf--g_rNCI1BciGmKFtZxePm8_Ch_VZwBr9_qYRTMP5hs8VaBzRrN60ad-g';
test('parseJWT', () => {
    const {header, payload, signature} = parseJWT(JWT);
    expect(header.alg).toBe('RS256');
    expect(payload.name).toBe('Rob Ennals');
})

test('getKeysForProviderAsync', async () => {
    get.mockResolvedValue({data: {keys: [{kid: 'key'}]}});
    addProviderKeyUrls({github: 'https://fake-url.com/'});
    const keys = await getKeysForProviderAsync('github');
    expect(keys[0].kid).toBe('key');
});

test('convertTokenAsync', async () => {
    setFirebaseAdmin({auth: () => ({
        getUserByEmail: () => ({uid: 'user'}),
        createCustomToken: () => 'loginToken'
    })});

    get.mockResolvedValue({data: {keys: [{
        kid: '93ADF1CE48F4CBAEB90C3F24E9D74BE9F54DBC12',
        x5c: ['publicKey']
    }]}});
    addProviderKeyUrls({github: 'https://fake-url.com/'});
    jwt.verify.mockReturnValue({name: 'Rob Ennals', email: 'rob@ennals.org'});

    const {loginToken} = await convertTokenAsync({ssoToken: JWT, provider: 'github'});
    expect(loginToken).toBe('loginToken');
});

