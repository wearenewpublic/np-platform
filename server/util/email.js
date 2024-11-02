const { readFileSync, existsSync } = require('fs');
const postmark = require('postmark');
const Mustache = require('mustache');
const path = require('path');
const { firebaseGetUserAsync } = require('./firebaseutil');

const domain = "https://psi.newpublic.org/";


var postmark_key = null;
function setPostmarkKey(key) {
    postmark_key = key;
}
exports.setPostmarkKey = setPostmarkKey;

async function sendEmailAsync(emailFields) {
    if (!postmark_key) {
        console.error('Postmark key not set. Cannot send email');
        return null;
    }

    const client = new postmark.ServerClient(postmark_key);
    try {
        const result = await client.sendEmail(emailFields)
        return result;
    } catch (error) {
        console.error('Unable to send email via postmark: ' + error);
        return null;
    }
}
exports.sendEmailAsync = sendEmailAsync;

function readTemplate(templateId, suffix) {

    const topPath = path.join(path.resolve('email-template'), templateId + suffix);
    const packagePath = path.join(path.resolve(__dirname, '..'), 'email-template', templateId + suffix);
    const packageNonLibPath = path.join(path.resolve(__dirname, '../..'), 'email-template', templateId + suffix);


    if (existsSync(topPath)) {
        return readFileSync(topPath, 'utf8').toString();
    } else if (existsSync(packagePath)) {
        return readFileSync(packagePath, 'utf8').toString();
    } else if (existsSync(packageNonLibPath)) {
        return readFileSync(packageNonLibPath, 'utf8').toString();
    } else {
        console.log(packagePath);
        console.log(topPath);
        throw new Error('Template not found: ' + templateId + suffix);
    }
}

// TODO: Allow for templates to be stored outside np-platform
async function sendTemplatedEmailAsync({
    serverstore, toUserId, templateId, 
    structureKey=serverstore.getStructureKey(), instanceKey=serverstore.getInstanceKey(), 
    ...data
}) {
    const toUser = await firebaseGetUserAsync(toUserId);
    const toPersona = await serverstore.getPersonaAsync(toUserId);
    const siloName = await serverstore.getModulePublicAsync('admin', 'name');

    const language = serverstore.getLanguage();    
    const siloKey = serverstore.getSiloKey();
    // const templateDir = path.join(path.dirname(__dirname), 'email-template');
    const jsonText = readTemplate(templateId, '.json');
    const htmlTemplate = readTemplate(templateId, '.html');
    const textTemplate = readTemplate(templateId, '.txt');
    const stringMap = JSON.parse(jsonText);
    const stringsForLanguage = stringMap[language.toLowerCase() ?? 'english'];

    const LINK = domain + '/' + siloKey + '/' + structureKey + '/' + instanceKey;

    const HtmlBody = Mustache.render(htmlTemplate, {...stringsForLanguage, siloName, ...data, LINK});
    const TextBody = Mustache.render(textTemplate, {...stringsForLanguage, siloName, ...data, LINK});
    const Subject = Mustache.render(stringsForLanguage.SUBJECT, data);
    const emailFields = {
        From: Mustache.render(stringsForLanguage.FROM, {...data, siloKey}),
        To: toPersona.name + ' <' + toUser.email + '>',
        Subject, HtmlBody, TextBody
    }

    return await sendEmailAsync(emailFields);
}
exports.sendTemplatedEmailAsync = sendTemplatedEmailAsync;
