const { sendEmailAsync, sendTemplatedEmailAsync } = require("../../util/email");
const { setObjectAsync, writeGlobalAsync, writeModulePublicAsync } = require("../../util/firebaseutil");
const { setTestData } = require("../../util/testutil");
const { sendNotifsForReplyApi } = require("../notifs");

// const sendEmail = jest.fn();

jest.mock('../../util/email', () => ({sendTemplatedEmailAsync: jest.fn()}));

test('sendNotifsForReplyApi', async () => {
    setTestData({
        silo: {rc: {
            'module-public': {admin: {name: 'Radio Canada'}},
            structure: {simplecomments: {instance: {demo: { 
                global: {name: 'My Conversation'},
                collection: {comment: {
                    '1': {text: 'Hello', from: 'testuser'},
                    '2': {text: 'My reply', from: 'testuser', replyTo: '1'}
                }}
            }}}}
        }}
    })

    const result = await sendNotifsForReplyApi({
        siloKey: 'rc', structureKey: 'simplecomments', instanceKey: 'demo', 
        parentKey: '1', replyKey: '2', language: 'English'
    });
    expect(sendTemplatedEmailAsync).toHaveBeenCalledWith({
        templateId: 'reply-notif', language: 'English',
        siloKey: 'rc', structureKey: 'simplecomments', instanceKey: 'demo',
        toUserId: 'testuser', replyText: 'My reply',
        siloName: 'Radio Canada', replyAuthorName: 'Test User', conversationName: 'My Conversation'
    });
    expect(result.success).toBe(true);
});