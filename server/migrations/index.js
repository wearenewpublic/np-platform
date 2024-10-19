import {AnonymizeAlphaUsersMigration} from "./anonymize_alpha_users";
import {AddQuestionProfileBacklinks} from "./add_question_profile_backlinks";

var global_migration_list = [
    AnonymizeAlphaUsersMigration,
    AddQuestionProfileBacklinks,
];

function addMigrations(newMigrations) {
    global_migration_list = [...global_migration_list, ...newMigrations];
}

function getMigrationList() {
    return global_migration_list;
}

export {addMigrations};
export {getMigrationList};
