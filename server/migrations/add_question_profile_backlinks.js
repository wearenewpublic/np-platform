
const AddQuestionProfileBacklinks = {
    key: 'add_question_profile_backlinks',
    name: 'Add Question Profile Backlinks',
    description: 'Make sure every profile has links to all questions that user participated in',
    runner: addQuestionProfileBacklinks
};

async function addQuestionProfileBacklinks({serverstore}) {
    const questionKeys = await serverstore.getStructureInstanceKeysAsync('question');   
    for (const questionKey of questionKeys) {
        const questionStore = serverstore.getRemoteStore({
            structureKey: 'question', instanceKey: questionKey
        });
        await connectAllPersonasForInstance({serverstore: questionStore});
    }
}

async function connectAllPersonasForInstance({serverstore}) {
    const personas = await serverstore.getCollectionAsync('persona');
    personas.forEach(persona => {
        serverstore.addPersonaToInstance({personaKey: persona.key, persona});
    });
}


exports.AddQuestionProfileBacklinks = AddQuestionProfileBacklinks;

