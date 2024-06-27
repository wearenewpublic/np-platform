
const ProfileComment = {
    input: {
        structure: 'simplecomments',
        triggerType: 'comment',
    },
    output: {
        structure: 'profile',
        type: 'derived_comment',
    },
    triggerMode: 'allWrites',
    trigger: ProfileCommentTriggerAsync
}

exports.ProfileComment = ProfileComment;

function ProfileCommentTriggerAsync({datastore, structureKey,instanceKey, value: comment}) {
    // console.log('ProfileCommentTrigger', {instanceKey, comment});

    datastore.setDerivedObject({
        structureKey: 'profile', 
        instanceKey: comment.from, 
        type: 'comment', 
        key: comment.key, 
        value: {...comment, instanceKey, structureKey}
    });
}
