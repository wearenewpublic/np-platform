const { sendTemplatedEmailAsync } = require("../util/email");
const { readObjectAsync, firebaseGetUserAsync, readGlobalAsync } = require("../util/firebaseutil");


async function sendNotifsForReplyApi({language, siloKey, structureKey, instanceKey, parentKey, replyKey}) {
    console.log('sendNotifsForReplyApi', {language, siloKey, structureKey, instanceKey, parentKey, replyKey});
    const pParentComment = readObjectAsync({siloKey, structureKey, instanceKey, collection: 'comment', key: parentKey});
    const pReplyComment = readObjectAsync({siloKey, structureKey, instanceKey, collection: 'comment', key: replyKey});
    const pConversationName = readGlobalAsync({siloKey, structureKey, instanceKey, key: 'name'});
    const parentComment = await pParentComment;
    const replyComment = await pReplyComment;
    const conversationName = await pConversationName;

    const replyAuthor = await firebaseGetUserAsync(replyComment.from);

    console.log('parentComment', parentComment);
    console.log('replyAuthor', replyAuthor);

    await sendTemplatedEmailAsync({
        templateId: 'reply-notif', language, 
        siloKey, structureKey, instanceKey, 
        toUserId: parentComment.from, replyText: replyComment.text,
        replyAuthorName: replyAuthor.displayName,
        conversationName: conversationName ?? 'Unnamed Conversation'
    });

    return {success: true, data: null};
}


exports.apiFunctions = {
    sendNotifsForReply: sendNotifsForReplyApi,
}

