import {profileConstructorAsync} from "./profile-constructor";

function nullConstructor() {}

var constructors = {   
    simplecomments: nullConstructor,
    componentdemo: nullConstructor,
    profile: profileConstructorAsync,
}

function getConstructor(structureKey) {
    return constructors[structureKey];
}
export {getConstructor};

function addConstructors(newConstructors) {
    constructors = {...constructors, ...newConstructors};
}
export {addConstructors};
