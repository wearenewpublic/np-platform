import { ComponentDemoStructure } from "../demo/demostructure";
import { EventLogStructure } from "./eventlog";
import { ProfileStructure } from "./profile";
import { SimpleCommentsStructure } from "./simplecomments";

export var structures = [
    SimpleCommentsStructure,
    ComponentDemoStructure,
    ProfileStructure,
    EventLogStructure
]

export function addStructures(newStructures) {
    structures = structures.concat(newStructures);
}
