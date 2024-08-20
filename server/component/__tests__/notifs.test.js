const { sendTemplatedEmailAsync } = require("../../util/email");
const { mockServerStore } = require("../../util/serverstore");
const { setTestData } = require("../../util/testutil");
const { sendNotifsForReplyApi } = require("../notifs");

// const sendEmail = jest.fn();

jest.mock('../../util/email', () => ({sendTemplatedEmailAsync: jest.fn()}));

test('sendNotifsForReplyApi', async () => {
    setTestData({
        silo: {testSilo: {
            'module-public': {admin: {name: 'Radio Canada'}},
            structure: {testStruct: {instance: {testInstance: { 
                global: {name: 'My Conversation'},
                collection: {comment: {
                    '1': {text: 'Hello', from: 'testuser'},
                    '2': {text: 'My reply', from: 'testuser', replyTo: '1'}
                }}
            }}}}
        }}
    })

    const serverstore = mockServerStore();

    const result = await sendNotifsForReplyApi({serverstore, parentKey: '1', replyKey: '2', language: 'English'});
    expect(sendTemplatedEmailAsync).toHaveBeenCalledWith({
        templateId: 'reply-notif', language: 'English',
        siloKey: 'testSilo', structureKey: 'testStruct', instanceKey: 'testInstance',
        toUserId: 'testuser', replyText: 'My reply',
        siloName: 'Radio Canada', replyAuthorName: 'Test User', conversationName: 'My Conversation'
    });
});