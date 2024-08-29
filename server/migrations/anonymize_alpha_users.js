const { firebaseGetUserListAsync } = require("../util/firebaseutil");

const AnonymizeAlphaUsersMigration = {
    key: 'anonymize_alpha_users',
    name: 'Anonymize Alpha Users',
    description: 'For all alpha users in the alpha user list, replace their names with a generated pseudonym',
    runner: anonymizeAlphaUsers
};

async function anonymizeAlphaUsers({serverstore}) {
    const userList = await firebaseGetUserListAsync();
    console.log('userList:', userList);

    const profileKeys = await serverstore.getStructureInstanceKeysAsync('profile');
    console.log('profileKeys:', profileKeys);

    // const questionKeys = await serverstore.getStructureInstanceKeysAsync('conversation');   
    // console.log('questionKeys:', questionKeys);


    // var allUsers = {};

    // for (const questionKey of questionKeys) {
    //     const questionStore = serverstore.getRemoteStore({
    //         structureKey: 'question', instanceKey: questionKey
    //     });
    //     const personas = await questionStore.getCollectionAsync('persona');
    //     for (const personaKey in personas) {
    //         const persona = personas[personaKey];
    //         allUsers[persona.key] = persona;
    //     }
    // }

    // console.log('allUsers:', allUsers);
}



exports.AnonymizeAlphaUsersMigration = AnonymizeAlphaUsersMigration;

