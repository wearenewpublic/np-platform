import { DemoFilterFeature } from "./DemoFilter";
import { LengthLimitFeature } from "./LengthLimitFeature";
import { DemoModerationFeature } from "./DemoModeration";
import { UpvoteFeature } from "./UpvoteFeature";
import { BasicTeaserFeature } from "./BasicTeaserFeature";
import { DemoProfileFeature } from "../demo/profile-config";
import { ProfileCommentsFeature } from "./ProfileCommentsFeature";
import { ReplyNotificationsFeature } from "./ReplyNotifsFeature";
import { DesignSystemDemoFeature } from "../demo/designsystem-demo";
import { CommentDemoFeature } from "../demo/comment-demo";
import { DemoFeature, DemoSecondaryFeature } from "../demo/comment-config";
import { ProfileDemoFeature } from "../demo/profile-demo";
import { EventlogDemoFeature } from "../demo/eventlog-demo";
import { ProfileEditDemo } from "../demo/profileedit-demo";
import { ProfilePhotoAndNameFeature } from "./ProfilePhotoAndName";
import { AdminUsersFeature } from "./AdminUsersFeature";
import { AdminDemo } from "../demo/admin-demo";
import { CloseConversationFeature } from "./CloseConversationFeature";
import { TopBarDemoFeature } from "../demo/topbar-demo";
import { BasicFeaturesDemoFeature } from "../demo/basicfeatures-demo";
import { OpenLinksInNewTabFeature } from "./OpenLinksInNewTabFeature";
import { EmbeddedInstanceDemoFeature } from "../demo/datamodel-demo";
import { LoginDemo } from "../demo/login-demo";
import { HelpDemoFeature } from "../demo/help-demo";

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
            CloseConversationFeature,
            OpenLinksInNewTabFeature
        ])
    ],
    profile: [
        SECTION('Developer', [
            DemoProfileFeature,
            ProfileCommentsFeature
        ]),
        SECTION('General', [
            ProfilePhotoAndNameFeature,
        ])
    ],
    componentdemo: [
        SECTION('Core Component Sets', [
            DesignSystemDemoFeature,
            CommentDemoFeature,
            ProfileDemoFeature,
            EventlogDemoFeature,
            ProfileEditDemo,
            AdminDemo,
            TopBarDemoFeature,
            BasicFeaturesDemoFeature,
            EmbeddedInstanceDemoFeature,
            LoginDemo,
            HelpDemoFeature
        ]),
        SECTION('Configuration', [
            OpenLinksInNewTabFeature
        ])
    ],
    admin: [
        SECTION('Admin Modules', [
            AdminUsersFeature
        ])
    ]
}

export var defaultFeatureConfig = {
    componentdemo: {
        demo_designsystem: true,
        demo_comment: true,
        demo_profile: true,
        demo_eventlog: true,
        demo_profileedit: true,
        demo_admin: true,
        demo_topbar: true,
        demo_basicfeatures: true,
        demo_embedded: true,
        demo_login: true,
        demo_help: true
    },
    simplecomments: {
        openlinksinnewtab: true       
    },
    profile: {
        profileeditname: true,
    },
    admin: {
        adminusers: true
    }
}

export var roles = {
    Owner: {
        allCapabilities: true,
        can: [
            'adminusers/modify-admins'
        ]
    },
    Developer: {
        inherits: ['Editorial', 'Super-Moderator', 'Analyst']
    },
    'Super-Moderator': {
        inherits: ['Moderator']
    },
    Moderator: {
    },
    Editorial: {
    },
    Analyst: {
        can: [
            'eventlog/view'
        ]
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
