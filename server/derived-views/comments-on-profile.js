const { triggerOnObjectWrite } = require("./templates");

exports.CommentsOnProfile = triggerOnObjectWrite('simplecomments', 'comment', 
    CommentsOnProfileAsync
);

async function CommentsOnProfileAsync({serverstore, value: comment, structureKey, instanceKey}) {
    serverstore.setDerivedObject({
        structureKey: 'profile', 
        instanceKey: comment.from, 
        type: 'derived_comment', 
        key: comment.key, 
        value: {...comment, instanceKey, structureKey}
    });
}

