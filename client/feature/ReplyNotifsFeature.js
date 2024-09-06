
export const ReplyNotificationsFeature = {
    name: 'Reply Notifications',
    key: 'replynotifications',
    config: {
        commentPostTriggers: [postTriggerAsync],
    }
}

async function postTriggerAsync({datastore, comment, commentKey}) {
    console.log('postTriggerAsync', comment, commentKey);
    const {replyTo} = comment;
    if (!replyTo) return;
    datastore.callServerAsync('notifs', 'sendNotifsForReply', {
        replyKey: commentKey, parentKey: replyTo
    });
}        
