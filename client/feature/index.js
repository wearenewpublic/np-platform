import { DemoFilterFeature } from "./DemoFilter";
import { LengthLimitFeature } from "./LengthLimitFeature";
import { DemoModerationFeature } from "./DemoModeration";
import { UpvoteFeature } from "./UpvoteFeature";
import { BasicTeaserFeature } from "./BasicTeaserFeature";
import { DemoProfileFeature } from "../demo/configprofile";
import { ProfileCommentsFeature } from "./ProfileCommentsFeature";
import { ReplyNotificationsFeature } from "./ReplyNotifsFeature";
import { DesignSystemDemoFeature } from "../demo/designsystem";
import { CommentDemoFeature } from "../demo/commentdemo";
import { DemoFeature, DemoSecondaryFeature } from "../demo/configcomment";
import { ProfileDemoFeature } from "../demo/demoprofile";

// const { DemoFeature, DemoSecondaryFeature } = require("./DemoFeature");

export function SECTION(label, features) {return {section: true, label, features}}
export function SUBSECTION(label, features) {return {section: true, level:2, label, features}}
export function COMPOSITE(parent, features) {return {composite: true, parent, features}}
export function CHOOSEONE(label, features) {return {chooseOne: true, label, features}}

export var features = {
    simplecomments: [
        SECTION('Developer', [
            COMPOSITE(DemoFeature, [
                DemoSecondaryFeature,
            ]),               
            DemoModerationFeature,
            DemoFilterFeature,    
        ]),
        SECTION('General', [
            UpvoteFeature,
            LengthLimitFeature,
            BasicTeaserFeature,
            ReplyNotificationsFeature,
        ])
    ],
    profile: [
        SECTION('Developer', [
            DemoProfileFeature,
        ]),
        SECTION('Activity', [
            ProfileCommentsFeature
        ])
    ],
    componentdemo: [
        SECTION('Core Component Sets', [
            DesignSystemDemoFeature,
            CommentDemoFeature,
            ProfileDemoFeature
        ])
    ]
}

export var defaultFeatureConfig = {
    componentdemo: {
        demo_designsystem: true,
        demo_comment: true,
        demo_profile: true
    },
    simplecomments: {},
    profile: {}
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
