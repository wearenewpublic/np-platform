const { AnonymizeAlphaUsersMigration } = require("./anonymize_alpha_users");
const { AddQuestionProfileBacklinks } = require("./add_question_profile_backlinks");

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

exports.addMigrations = addMigrations;
exports.getMigrationList = getMigrationList;
