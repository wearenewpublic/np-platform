const { NullConstructor } = require("./null-constructor");
const { ProfileConstructor } = require("./profile-constructor");

var constructors = {   
    simplecomments: NullConstructor,
    componentdemo: NullConstructor,
    profile: ProfileConstructor
}

function getConstructor(structureKey) {
    const constructor = constructors[structureKey];
    if (!constructor) {
        console.error('No constructor found for ' + structureKey);
        console.error('Available constructors: ' + Object.keys(constructors).join(', '));
    }
    return constructor;
}
exports.getConstructor = getConstructor;

function addConstructors(newConstructors) {
    constructors = {...constructors, ...newConstructors};
}
exports.addConstructors = addConstructors;
