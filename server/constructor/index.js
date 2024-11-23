const { profileConstructorAsync } = require("./profile-constructor");

function nullConstructor() {}

var constructors = {   
    simplecomments: nullConstructor,
    componentdemo: nullConstructor,
    profile: profileConstructorAsync,
}

function getConstructor(structureKey) {
    return constructors[structureKey];
}
exports.getConstructor = getConstructor;

function addConstructors(newConstructors) {
    constructors = {...constructors, ...newConstructors};
}
exports.addConstructors = addConstructors;
