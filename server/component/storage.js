const admin = require('firebase-admin');
const fs = require('fs');

const bucket = admin.storage().bucket();
const db = admin.database();

async function uploadFileAsync({file, userId, extension, contentType, prototypeKey, instanceKey}) {
    const fileBuffer = fs.readFileSync(file);
    const fileKey = db.ref().push().key;
    const filename = `user/${userId}/${prototypeKey}/${instanceKey}/${fileKey}.${extension}`;
    const fbFile = bucket.file(filename, {contentType, public: true});   
    await fbFile.save(fileBuffer);
    return {data: {userId: userId || 'null', fileKey}};
}

exports.apiFunctions = {
    uploadFile: uploadFileAsync,
}



