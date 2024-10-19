
import {sendTemplatedEmailAsync} from "../../util/email";
import {mockServerStore} from "../../util/serverstore";
import {sendNotifsForReplyApi} from "../notifs";
import {jest} from '@jest/globals';

jest.mock('../../util/email');

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
        serverstore: expect.anything(),
        templateId: 'reply-notif', 
        toUserId: 'testuser', replyText: 'My reply',
        replyAuthorName: 'Test User', conversationName: 'My Conversation'
    });
});