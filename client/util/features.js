import { defaultFeatureConfig, features } from "../feature";
import { ConfigContext, useDatastore, useGlobalProperty, useStructureKey } from "./datastore";
import React, { useContext } from 'react';


export function useConfig() {
    const config = useContext(ConfigContext);
    return config;
}

export function useIsReadOnly() {
    const {readOnly} = useConfig();
    return readOnly;
}

export function REPLACE(array) {
    return {REPLACE: array};
}

export function FIRST(array) {
    return {FIRST: array};
}

export function useEnabledFeatures() {
    const structureKey = useStructureKey();
    const tunnedOnFeatures = useGlobalProperty('features');
    const defaultFeatures = defaultFeatureConfig[structureKey];
    return {...defaultFeatures, ...tunnedOnFeatures};
}

export function assembleConfig({structure, activeFeatures, includeDefaults=true}) {
    var config = cloneConfig(structure.defaultConfig);
    const defaultFeatures = includeDefaults ? defaultFeatureConfig[structure.key] : {};
    const mergedActiveFeatures = {...defaultFeatures, ...activeFeatures} 
    const availableFeatures = getAvailableFeaturesForStructure(structure.key, mergedActiveFeatures);

    try {
        availableFeatures.forEach(feature => {
            if (feature.parentFeature && !mergedActiveFeatures[feature.parentFeature]) return;
            if (mergedActiveFeatures[feature.key]) {
                Object.keys(feature.config ?? {}).forEach(key => {
                    if (!(key in config)) {
                        console.error('Feature key not found in config', {key, feature, config});
                    } else {
                        const featureParam = feature.config[key];
                        if (Array.isArray(featureParam)) {
                            config[key] = [...config[key], ...featureParam];
                        } else if (featureParam && featureParam.FIRST) {
                            config[key] = [...featureParam.FIRST, ...config[key]];
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
    const defaultFeatures = defaultFeatureConfig[structure.key];
    const mergedActiveFeatures = {...defaultFeatures, ...activeFeatures} 
    const availableFeatures = getAvailableFeaturesForStructure(structure.key, mergedActiveFeatures);
   
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

export function flattenFeatureBlocks(featureList, mergedActiveFeatures=null) {
    var flattened = [];
    featureList.forEach(feature => {
        if (feature.parent) {
            flattened.push(feature.parent);
        }
        if (feature.composite) {
            if (!mergedActiveFeatures || mergedActiveFeatures[feature.parent.key]) {
                flattened = [...flattened, ...flattenFeatureBlocks(feature.features, mergedActiveFeatures)];
            }
        } else if (feature.features) {
            flattened = [...flattened, ...flattenFeatureBlocks(feature.features, mergedActiveFeatures)];
        } else {
            flattened.push(feature);
        }
    })
    return flattened;
}

export function getAvailableFeaturesForStructure(structureKey, mergedActiveFeatures) {
    return flattenFeatureBlocks(features[structureKey] || [], mergedActiveFeatures);
}

export function getFeatureBlocks(structureKey) {
    return features[structureKey] || [];
}

