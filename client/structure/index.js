import { ComponentDemoPrototype } from "./componentdemo";
import { SimpleCommentsPrototype } from "./simplecomments";

export var prototypes = [
    SimpleCommentsPrototype,
    ComponentDemoPrototype,
]

export function addPrototypes(newPrototypes) {
    prototypes = prototypes.concat(newPrototypes);
}
