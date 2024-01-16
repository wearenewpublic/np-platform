import { UpvoteFeature } from "./UpvoteFeature";

const { DemoFeature } = require("./DemoFeature");

export var features = {
    componentdemo: [
        DemoFeature
    ],
    simplecomments: [
        UpvoteFeature
    ]
}

export var defaultFeatureConfig = {
    componentdemo: {
        upvote: true,
    },
    simplecomments: {
        upvote: true
    }
}

export function addFeatures(newFeaturesForStructs) {
    Object.keys(newFeaturesForStructs).forEach(structureKey => {
        const oldFeatures = features[structureKey] || [];
        const newFeatures = newFeaturesForStructs[structureKey];
        features[structureKey] = [...oldFeatures, ...newFeatures]
    })
}

export function addDefaultFeatures(newDefaultFeatures) {
    Object.keys(newDefaultFeatures).forEach(structureKey => {
        const newDefaults = newDefaultFeatures[structureKey];
        const oldDefaults = defaultFeatureConfig[structureKey] || {};
        const mergedDefaults = {...oldDefaults, ...newDefaults};
        defaultFeatureConfig[structureKey] = mergedDefaults;
    })
}
