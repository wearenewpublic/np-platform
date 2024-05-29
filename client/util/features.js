import React, { useContext } from "react";
import { defaultFeatureConfig, features } from "../feature";

export const ConfigContext = React.createContext({});

export function useConfig() {
    const config = useContext(ConfigContext);
    return config;
}

export function REPLACE(array) {
    return {REPLACE: array};
}

export function assembleConfig({structure, activeFeatures}) {
    var config = cloneConfig(structure.defaultConfig);
    const availableFeatures = features[structure.key] ?? [];

    const defaultFeatures = defaultFeatureConfig[structure.key];
    const mergedActiveFeatures = {...defaultFeatures, ...activeFeatures} 

    availableFeatures.forEach(feature => {
        if (mergedActiveFeatures[feature.key]) {
            Object.keys(feature.config).forEach(key => {
                if (!(key in config)) {
                    console.error('Feature key not found in config', {key, feature, config});
                } else {
                    const featureParam = feature.config[key];
                    if (Array.isArray(featureParam)) {
                        config[key] = [...config[key], ...featureParam];
                    } else if (featureParam && featureParam.REPLACE) {
                        config[key] = featureParam.REPLACE;
                    } else if (featureParam !== undefined) {
                        config[key] = featureParam;
                    }
                }
            });
            if (feature.defaultConfig) {                
                config = {...config, ...feature.defaultConfig};
            }
        }
    })

    return config;
}

function cloneConfig(config) {
    config = {...config};
    Object.keys(config).forEach(key => {
        if (Array.isArray(config[key])) {
            config[key] = [...config[key]];
        }
    })
    return config;
}

export function getAvailableFeaturesForStructure(structureKey) {
    return features[structureKey] || [];
}

  
