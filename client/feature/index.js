const { DemoFeature } = require("./DemoFeature");

export var features = {
    componentdemo: [
        DemoFeature
    ]
}

export function addStructures(newStructures) {
    structures = structures.concat(newStructures);
}
