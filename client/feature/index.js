import { DemoFilterFeature } from "./DemoFilter";
import { LengthLimitFeature } from "./LengthLimitFeature";
import { DemoModerationFeature } from "./DemoModeration";
import { UpvoteFeature } from "./UpvoteFeature";
import { BasicTeaserFeature } from "./BasicTeaserFeature";
import { DemoProfileFeature } from "./DemoProfileFeature";

const { DemoFeature } = require("./DemoFeature");

export var features = {
    componentdemo: [
        DemoFeature,
        LengthLimitFeature,
        UpvoteFeature,
        DemoModerationFeature
    ],
    simplecomments: [
        UpvoteFeature,
        LengthLimitFeature,
        DemoModerationFeature,
        DemoFilterFeature,
        BasicTeaserFeature
    ],
    profile: [
        DemoProfileFeature
    ]
}

export var defaultFeatureConfig = {
    componentdemo: {
        upvote: true,
        lengthlimit: true
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
