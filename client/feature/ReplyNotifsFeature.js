import { callServerApiAsync } from "../util/servercall";

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
    await callServerApiAsync({datastore, component: 'notifs', funcname: 'sendNotifsForReply', params: {
        replyKey: commentKey, parentKey: replyTo}
    });
}        
