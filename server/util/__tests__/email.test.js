jest.mock('postmark');

import {readFileSync, read} from "fs";
import {sendEmailAsync, setPostmarkKey, sendTemplatedEmailAsync} from "../email";
import {getLastEmailSent} from "postmark";
import {mockServerStore} from "../serverstore";

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
    const toPersona = {name: 'Test User Godzilla'};
    const serverstore = mockServerStore();
    await sendTemplatedEmailAsync({
        serverstore,
        templateId: 'reply-notif', 
        toPersona, toUserId: 'testuser', replyText: 'My reply',
        siloName: 'Radio Canada', replyAuthorName: 'Test User', conversationName: 'My Conversation'
    });
    expect(getLastEmailSent()).toMatchSnapshot();
})
