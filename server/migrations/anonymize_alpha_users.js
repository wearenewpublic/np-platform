import {readFileSync, existsSync} from "fs";
import {firebaseGetUserListAsync} from "../util/firebaseutil";
import {updateProfileAsync} from "../component/profile";

// Replace the names of a list of alpha users with generated pseudonyms
// This requires that add_question_profile_backlinks has already been run so that we have
// properly generated profiles for all users, and backlinks to their conversations.

const AnonymizeAlphaUsersMigration = {
    key: 'anonymize_alpha_users',
    name: 'Anonymize Alpha Users',
    description: 'For all alpha users in the alpha user list, replace their names with a generated pseudonym',
    requires: 'add_question_profile_backlinks',
    runner: anonymizeAlphaUsers
};

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


function getUsersToRename({userList, profileKeys, domainsToNotRename, emailsToNotRename}) {
    var usersToRename = [];
    userList.forEach(user => {
        const emailDomain = user.email.split('@')[1];
        if (!emailsToNotRename.includes(user.email) && 
            !domainsToNotRename.includes(emailDomain) &&
            profileKeys.includes(user.uid)
        ) {
            usersToRename.push(user)
        }
    })
    return usersToRename;
}

function makeHueForString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to a 32bit integer
    }
    return Math.abs(hash) % 360;
}

async function anonymizeAlphaUsers({serverstore, migrationLog}) {
    const siloKey = serverstore.getSiloKey();
    const userList = await firebaseGetUserListAsync();
    const profileKeys = await serverstore.getStructureInstanceKeysAsync('profile');
    const emailsToNotRename = readFileSync(__dirname + '/data/users_to_not_rename.txt', 'utf8').toString().split('\n');
    const domainsToNotRename = readFileSync(__dirname + '/data/domains_to_not_rename.txt', 'utf8').toString().split('\n');
    if (!existsSync(__dirname + '/data/names_'+ siloKey + '.txt')) {
        console.log('No names file found for silo:', siloKey);
        return;
    }
    var newnames = readFileSync(__dirname + '/data/names_'+ siloKey + '.txt', 'utf8').toString().split('\n').filter(x=>x).map(x => removeAccents(x));

    const usersToRename = getUsersToRename({
        siloKey, userList, profileKeys, domainsToNotRename, emailsToNotRename
    });

    for (const user of usersToRename) {
        const newname = newnames.pop();
        const profileStore = serverstore.getRemoteStore({
            structureKey: 'profile', instanceKey: user.uid, 
            userId: user.uid, userEmail: user.email
        });
        const updates = {name: newname, photoUrl: null, 
            hue: makeHueForString(user.uid), nameMode: 'custom',
            photoMode: 'letter', emailNotifsDisabled: true
        };
        const preview = {name: newname, photoUrl: null, hue: updates.hue};
        // console.log('Renaming user:', user.email, user.displayName, 'to', newname);
        migrationLog.push('Renaming user: ' + user.email + ' to ' + newname + ' in '+ siloKey);
        if (!newname.trim()) {
            throw new Error('Out of names: ' + user.email, newnames, newname);
        }
        await updateProfileAsync({serverstore: profileStore, updates, preview});
    }
}



export {AnonymizeAlphaUsersMigration};

