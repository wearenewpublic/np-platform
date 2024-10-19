const { getUserByEmail, createCustomToken } = require("../../util/testutil");
const { authCallbackAsync } = require("../auth");
const { post, get } = require("axios");


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
