const { readFileSync, read } = require("fs");
const { sendEmailAsync, setPostmarkKey, sendTemplatedEmailAsync } = require("../email");
const { getLastEmailSent } = require("../../__mocks__/postmark");

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

test('sendTemplatedEmailAsync', async () => {
    setPostmarkKey('mocked-api-key');
    await sendTemplatedEmailAsync({
        templateId: 'reply-notif', language: 'English',
        siloKey: 'testSilo', structureKey: 'testStruct', instanceKey: 'testInstance',
        toUserId: 'testuser', replyText: 'My reply',
        siloName: 'Radio Canada', replyAuthorName: 'Test User', conversationName: 'My Conversation'
    });
    expect(getLastEmailSent()).toMatchSnapshot();
})
