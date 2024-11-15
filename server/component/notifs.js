const { sendTemplatedEmailAsync } = require("../util/email");

async function sendNotifsForReplyApi({serverstore, language, parentKey, replyKey}) {
    const pParentComment = serverstore.getObjectAsync('comment', parentKey);
    const pReplyComment = serverstore.getObjectAsync('comment', replyKey);
    const pConversationName = serverstore.getGlobalPropertyAsync('name');
    const pSiloName = serverstore.getModulePublicAsync('admin', 'name');

    const parentComment = await pParentComment;
    const replyComment = await pReplyComment;
    const conversationName = await pConversationName;

    if (!parentComment || !replyComment) {
        throw new Error('Parent or reply comment not found:' + parentKey + ' ' + replyKey);
    }

    const siloName = await pSiloName ?? serverstore.getSiloKey().toUpperCase();
    const replyAuthorPersona = await serverstore.getPersonaAsync(replyComment.from);
    const toFields = await serverstore.getRemoteGlobalAsync({
        structureKey: 'profile', instanceKey: parentComment?.from, key: 'fields'
    });

    if (toFields?.emailNotifsDisabled) {
        return;
    }

    await sendTemplatedEmailAsync({
        serverstore, templateId: 'reply-notif',  
        toUserId: parentComment.from, replyText: replyComment.text,
        replyAuthorName: replyAuthorPersona.name,
        conversationName: conversationName ?? 'Unnamed Conversation'
    });
}
exports.sendNotifsForReplyApi = sendNotifsForReplyApi;

exports.publicFunctions = {
    sendNotifsForReply: sendNotifsForReplyApi,
}

