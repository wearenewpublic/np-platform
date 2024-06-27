const { sendEmailAsync, setPostmarkKey } = require("../email");

jest.mock('postmark');

test('sendEmailAsync', async () => {
    const email = {
        From: 'Godzilla <godzilla@tokyo.jp>',
        To: 'Mothra <mothra@gmail.com>',
        Subject: 'Godzilla vs. Mothra',
        TextBody: 'Godzilla and Mothra will fight in Tokyo Bay',
        HtmlBody: '<p>Godzilla and Mothra will fight in Tokyo Bay</p>'
    };
    setPostmarkKey('mocked-api-key');
    const result = await sendEmailAsync(email);
    expect(result.MessageID).toBe('mocked-message-id');
});

