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

    try {
        availableFeatures.forEach(feature => {
            if (mergedActiveFeatures[feature.key]) {
                Object.keys(feature.config ?? {}).forEach(key => {
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
    } catch (e) {
        console.error('Error assembling config, using defaults', e);
        return cloneConfig(structure.defaultConfig);
    }
}

 
export function assembleScreenSet({structure, activeFeatures}) {
    const availableFeatures = features[structure.key] ?? [];
    const defaultFeatures = defaultFeatureConfig[structure.key];
    const mergedActiveFeatures = {...defaultFeatures, ...activeFeatures} 

    var screenSet = {...structure.subscreens};
    availableFeatures.forEach(feature => {
        if (mergedActiveFeatures[feature.key]) {
            screenSet = {...screenSet, ...feature.subscreens};
        }
    })
    return screenSet;
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

  
