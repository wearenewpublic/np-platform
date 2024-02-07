import { ComponentDemoStructure } from "./componentdemo";
import { ProfileStructure } from "./profile";
import { SimpleCommentsStructure } from "./simplecomments";

export var structures = [
    SimpleCommentsStructure,
    ComponentDemoStructure,
    ProfileStructure
]

export function addStructures(newStructures) {
    structures = structures.concat(newStructures);
}
