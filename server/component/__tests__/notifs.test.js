const { sendTemplatedEmailAsync } = require("../../util/email");
const { mockServerStore } = require("../../util/serverstore");
const { sendNotifsForReplyApi } = require("../notifs");

jest.mock('../../util/email', () => ({sendTemplatedEmailAsync: jest.fn()}));

test('noNotifIfDisabled', async () => {
    const serverstore = mockServerStore();
    serverstore.setRemoteGlobal({
        structureKey: 'profile', 
        instanceKey: 'testuser', 
        key: 'fields', value: {emailNotifsDisabled: true}
    });
    serverstore.setObject('comment', '1', {text: 'Hello', from: 'testuser'});
    serverstore.setObject('comment', '2', {text: 'My reply', from: 'testuser', replyTo: '1'});
    await serverstore.commitDataAsync();

    await sendNotifsForReplyApi({serverstore, parentKey: '1', replyKey: '2', language: 'English'});
    expect(sendTemplatedEmailAsync).not.toHaveBeenCalled();
})

test('sendNotifsForReplyApi', async () => {
    const serverstore = mockServerStore();
    serverstore.setModulePublic('admin', 'name', 'Radio Canada');
    serverstore.setGlobalProperty('name', 'My Conversation');
    serverstore.setObject('comment', '1', {text: 'Hello', from: 'testuser'});
    serverstore.setObject('comment', '2', {text: 'My reply', from: 'testuser', replyTo: '1'});
    await serverstore.commitDataAsync();

    const result = await sendNotifsForReplyApi({serverstore, parentKey: '1', replyKey: '2', language: 'English'});
    expect(sendTemplatedEmailAsync).toHaveBeenCalledWith({
        templateId: 'reply-notif', language: 'English',
        siloKey: 'testSilo', structureKey: 'testStruct', instanceKey: 'testInstance',
        toUserId: 'testuser', replyText: 'My reply',
        toPersona: {key: 'testuser', name: 'Test User', photoUrl: 'photo-url'},
        siloName: 'Radio Canada', replyAuthorName: 'Test User', conversationName: 'My Conversation'
    });
});