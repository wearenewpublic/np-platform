import { DemoFilterFeature } from "./DemoFilter";
import { LengthLimitFeature } from "./LengthLimitFeature";
import { DemoModerationFeature } from "./DemoModeration";
import { UpvoteFeature } from "./UpvoteFeature";
import { BasicTeaserFeature } from "./BasicTeaserFeature";
import { DemoProfileFeature } from "./DemoProfileFeature";
import { ProfileCommentsFeature } from "./ProfileCommentsFeature";
import { ReplyNotificationsFeature } from "./ReplyNotifsFeature";
import { DesignSystemDemoFeature } from "../demo/designsystem";
import { CommentDemoFeature } from "../demo/commentdemo";

const { DemoFeature, DemoSecondaryFeature } = require("./DemoFeature");

export var features = {
    simplecomments: [
        DemoFeature,
        DemoSecondaryFeature,
        UpvoteFeature,
        LengthLimitFeature,
        DemoModerationFeature,
        DemoFilterFeature,
        BasicTeaserFeature,
        ReplyNotificationsFeature,
    ],
    profile: [
        DemoProfileFeature,
        ProfileCommentsFeature
    ],
    componentdemo: [
        DesignSystemDemoFeature,
        CommentDemoFeature,
    ]
}

export var defaultFeatureConfig = {
    componentdemo: {
        demo_designsystem: true,
        demo_comment: true
    },
    simplecomments: {
        upvote: true
    },
    profile: {
        profilecomments: true    
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
