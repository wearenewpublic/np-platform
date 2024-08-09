const { sendTemplatedEmailAsync } = require("../util/email");
const { readObjectAsync, firebaseGetUserAsync, readGlobalAsync, firebaseReadAsync } = require("../util/firebaseutil");


async function sendNotifsForReplyApi({language, siloKey, structureKey, instanceKey, parentKey, replyKey}) {
    const pParentComment = readObjectAsync({siloKey, structureKey, instanceKey, collection: 'comment', key: parentKey});
    const pReplyComment = readObjectAsync({siloKey, structureKey, instanceKey, collection: 'comment', key: replyKey});
    const pConversationName = readGlobalAsync({siloKey, structureKey, instanceKey, key: 'name'});
    const pSiloName = firebaseReadAsync(['silo', siloKey, 'module-public', 'admin', 'name']);

    const parentComment = await pParentComment;
    const replyComment = await pReplyComment;

    const conversationName = await pConversationName;
    const siloName = await pSiloName ?? siloKey.toUpperCase();
    const replyAuthor = await firebaseGetUserAsync(replyComment.from);

    await sendTemplatedEmailAsync({
        templateId: 'reply-notif', language, 
        siloKey, structureKey, instanceKey, 
        toUserId: parentComment.from, replyText: replyComment.text,
        siloName,
        replyAuthorName: replyAuthor.displayName,
        conversationName: conversationName ?? 'Unnamed Conversation'
    });

    return {success: true, data: null};
}
exports.sendNotifsForReplyApi = sendNotifsForReplyApi;

exports.apiFunctions = {
    sendNotifsForReply: sendNotifsForReplyApi,
}

