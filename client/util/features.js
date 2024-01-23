import React, { useContext } from "react";
import { AdminScreen } from "../component/admin";
import { defaultFeatureConfig, features } from "../feature";
import { InstanceContext } from "../organizer/InstanceContext";
import { structures } from "../structure";
import { Datastore } from "./datastore";
import { deepClone } from "./util";


export const ConfigContext = React.createContext({});

export function useConfig() {
    const config = useContext(ConfigContext);
    return config;
}

export function assembleConfig({structure, activeFeatures}) {
    var config = cloneConfig(structure.defaultConfig);
    const availableFeatures = features[structure.key] ?? [];

    const defaultFeatures = defaultFeatureConfig[structure.key];
    const mergedActiveFeatures = {...defaultFeatures, ...activeFeatures} 

    availableFeatures.forEach(feature => {
        if (mergedActiveFeatures[feature.key]) {
            Object.keys(config).forEach(key => {
                const featureParam = feature.config[key];
                if (Array.isArray(featureParam)) {
                    config[key] = [...config[key], ...featureParam];
                } else if (featureParam) {
                    config[key] = featureParam;
                }
            });
        }
    })

    return config;
}

function cloneConfig(config) {
    var config = {...config};
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

export function StructureInstance({structureKey, instanceKey}) {
    const structure = chooseStructureByKey(structureKey);    
    const screenSet = {...defaultScreens, ...structure.subscreens};
    var screen = getScreen({screenSet, structure, screenKey, instanceKey});
    var title = getScreenTitle({screenSet, structure, screenKey, instance, params}); 
  
    const instance = chooseInstanceByKey({structure, instanceKey});

    return <InstanceContext.Provider value={{structure, structureKey, instance, instanceKey, isLive: true}}>
        <Datastore instance={instance} instanceKey={instanceKey} structure={structure} structureKey={structureKey} isLive={true}>
        </Datastore>
    </InstanceContext.Provider>
}

export function InstanceWithFeatures({}) {

}

const defaultScreens = {
    admin: () => <AdminScreen />
  }
  

function chooseStructureByKey(key) {
    if (!key) return null;
    return structures.find(structure => structure.key === key);
}
  
function chooseInstanceByKey({structure, instanceKey}) {
    return {isLive: true}
}
  
function getScreen({screenSet, structure, screenKey}) {
    if (!screenKey) {
        return structure.screen;
    } else if (screenKey == 'teaser') {
        return structure.teaser;
    } else {
        return screenSet[screenKey];
    }
}

