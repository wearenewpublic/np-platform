const { NullConstructor } = require("./null-constructor");
const { ProfileConstructor } = require("./profile-constructor");

var constructors = {   
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

