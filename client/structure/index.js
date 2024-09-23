import { ComponentDemoStructure } from "./componentdemo";
import { EventLogStructure } from "./eventlog";
import { ProfileStructure } from "./profile";
import { SimpleCommentsStructure } from "./simplecomments";
import { MigrationsStructure } from "./migrations";
import { LoginStructure } from "./login";
import { AdminStructure } from "./admin";

export var structures = [
    SimpleCommentsStructure,
    ComponentDemoStructure,
    ProfileStructure,
    EventLogStructure,
    MigrationsStructure,
    LoginStructure,
    AdminStructure
]

export function addStructures(newStructures) {
    structures = structures.concat(newStructures);
}
