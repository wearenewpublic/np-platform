const { DemoFeature } = require("./DemoFeature");

export var features = {
    componentdemo: [
        DemoFeature
    ]
}

export function addFeatures(newFeaturesForStructs) {
    Object.keys(newFeaturesForStructs).forEach(structureKey => {
        const oldFeatures = features[structureKey] || [];
        const newFeatures = newFeaturesForStructs[structureKey];
        features[structureKey] = [...oldFeatures, ...newFeatures]
    })
}

