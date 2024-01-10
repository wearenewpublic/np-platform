import React, { useContext } from "react";
import { AdminScreen } from "../component/admin";
import { features } from "../feature";
import { PrototypeContext } from "../organizer/PrototypeContext";
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

    availableFeatures.forEach(feature => {
        if (activeFeatures[feature.key]) {
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

export function getAvailableFeaturesForPrototype(prototypeKey) {
    return features[prototypeKey] || [];
}

export function StructureInstance({structureKey, instanceKey}) {
    const structure = chooseStructureByKey(structureKey);    
    const screenSet = {...defaultScreens, ...prototype.subscreens};
    var screen = getScreen({screenSet, prototype, screenKey, instanceKey});
    var title = getScreenTitle({screenSet, prototype, screenKey, instance, params}); 
  
    const instance = chooseInstanceByKey({structure, instanceKey});

    return <PrototypeContext.Provider value={{prototype, prototypeKey, instance, instanceKey, isLive: true}}>
        <Datastore instance={instance} instanceKey={instanceKey} prototype={prototype} prototypeKey={prototypeKey} isLive={true}>
        </Datastore>
    </PrototypeContext.Provider>
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
  
function getScreen({screenSet, prototype, screenKey}) {
    if (!screenKey) {
        return prototype.screen;
    } else if (screenKey == 'teaser') {
        return prototype.teaser;
    } else {
        return screenSet[screenKey];
    }
}

