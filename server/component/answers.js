const {personaList} = require('./personas');
const {readGlobalAsync, updateCollectionAsync} = require('../util/firebaseutil');
const {callGptAsync, getGptJsonAsync} = require('./chatgpt');

const prototypeQuestion = 'question';

async function generateExampleAnswersAsync({instanceKey, language}) {
    const count = Math.floor((Math.random() * 6) + 4);
    const question = await readGlobalAsync({prototype: prototypeQuestion, instance: instanceKey, key: 'name'});
    console.log('generateExampleAnswersAsync', {instanceKey, question, count});
    if (!question) {
        return {success: false, error: 'No question found'}
    }
    const answers = await getGptJsonAsync({promptKey: 'example_answers', params: {count, question},
        language, model: 'gpt4'});
    console.log('answers', answers);
    await addExampleUsersAsync({instanceKey});
    await addExampleAnswersAsync({instanceKey, answers});
    return {data: {answers}}
}

function addExampleAnswersAsync({instanceKey, answers}) {
    var updates = {};
    const randomizedPersonas = personaList.sort(() => Math.random() - 0.5);
    const dayMillis = 1000 * 3600 * 24;
    answers.slice(0, personaList.length).forEach(answer => {
        const persona = randomizedPersonas.pop();
        updates[persona.key] = {
            key: persona.key,
            from: persona.key,
            text: answer,
            time: Date.now() - Math.floor(Math.random() * dayMillis),
        }
    })
    return updateCollectionAsync({prototype: prototypeQuestion, instance: instanceKey, 
        collection: 'comment', updates});
}

function addExampleUsersAsync({instanceKey}) {
    var updates = {};
    personaList.forEach(persona => {
        updates[persona.key] = {
            key: persona.key,
            name: persona.name,
            photoUrl: 'https://np-psi-dev.web.app/faces/' + persona.face
        }
    })   
    return updateCollectionAsync({prototype: prototypeQuestion, instance: instanceKey, 
        collection: 'persona', updates});
}

exports.apiFunctions = {
    generateAnswers: generateExampleAnswersAsync,
}
