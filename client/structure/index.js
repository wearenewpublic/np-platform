import { ComponentDemoStructure } from "./componentdemo";
import { EventLogStructure } from "./eventlog";
import { ProfileStructure } from "./profile";
import { SimpleCommentsStructure } from "./simplecomments";
import { MigrationsStructure } from "./migrations";

export var structures = [
    SimpleCommentsStructure,
    ComponentDemoStructure,
    ProfileStructure,
    EventLogStructure,
    MigrationsStructure,
]

export function addStructures(newStructures) {
    structures = structures.concat(newStructures);
}
