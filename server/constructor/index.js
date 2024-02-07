const { NullConstructor } = require("./null-constructor");
const { ProfileConstructor } = require("./profile-constructor");

const constructors = {   
    simplecomments: NullConstructor,
    componentdemo: NullConstructor,
    profile: ProfileConstructor
}

function getConstructor(structureKey) {
    return constructors[structureKey];
}
exports.getConstructor = getConstructor;

function addConstructors(newConstructors) {
    constructors = {...constructors, ...newConstructors};
}
exports.addConstructors = addConstructors;

