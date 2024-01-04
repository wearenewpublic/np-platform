import { ComponentDemoStructure } from "./componentdemo";
import { SimpleCommentsStructure } from "./simplecomments";

export var structures = [
    SimpleCommentsStructure,
    ComponentDemoStructure,
]

export function addStructures(newStructures) {
    structures = structures.concat(newStructures);
}
