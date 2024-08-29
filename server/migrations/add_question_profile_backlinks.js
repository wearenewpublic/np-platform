
const AddQuestionProfileBacklinks = {
    key: 'add_question_profile_backlinks',
    name: 'Add Question Profile Backlinks',
    description: 'Make sure every profile has links to all questions that user participated in',
    runner: addQuestionProfileBacklinks
};

async function addQuestionProfileBacklinks({serverstore}) {
    console.log('addQuestionProfileBacklinks', serverstore.getSiloKey(), serverstore.getStructureKey());
    const questionKeys = await serverstore.getStructureInstanceKeysAsync('question');   
    console.log('questionKeys:', questionKeys);

    for (const questionKey of questionKeys) {
        const questionStore = serverstore.getRemoteStore({
            structureKey: 'question', instanceKey: questionKey
        });
        await connectAllPersonasForInstance({serverstore: questionStore});
    }
}

async function connectAllPersonasForInstance({serverstore}) {
    console.log('connectAllPersonasForInstance', serverstore.getInstanceKey());
    const personas = await serverstore.getCollectionAsync('persona');
    console.log('personas:', personas);
    personas.forEach(persona => {
        console.log('persona:', persona);
        serverstore.addPersonaToInstance({personaKey: persona.key, persona});
    });
    // for (const persona in personas) {
    //     console.log('persona:', persona);
    //     serverstore.addPersonaToInstance({personaKey: persona.key, persona});
    // }
}


exports.AddQuestionProfileBacklinks = AddQuestionProfileBacklinks;

