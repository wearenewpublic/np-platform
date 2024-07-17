import { InstanceContext } from '../organizer/InstanceContext';
import { StackedScreen, getStructureForKey } from './instance';
import { SharedData, SharedDataContext } from './shareddata';
import { Datastore } from './datastore';
import { ConfigContext, assembleConfig } from './features';
import { mock_setFirebaseData } from './firebase';
import { useIsAdminForSilo } from '../component/admin';

var global_sharedData = new SharedData();

beforeEach(() => {
    resetSharedData();
});

export function resetSharedData() {
    global_sharedData = new SharedData();
}

export function getSharedData() {
    return global_sharedData;
}

export function WithFeatures({siloKey='test', structureKey='componentdemo', instanceKey='test', isAdmin=false, features={}, children}) {
    const structure = getStructureForKey(structureKey);
    const instance = {isLive: false, ...global_sharedData.data};
    const config = assembleConfig({structure, activeFeatures:features});
    return <InstanceContext.Provider value={{siloKey, structureKey, structure, instanceKey, instance, isAdmin, isLive: false}}>
        <SharedDataContext.Provider value={global_sharedData}>
            <Datastore 
                siloKey={siloKey}
                structureKey={structureKey} structure={structure} 
                instanceKey={instanceKey} instance={instance}
                isAdmin={isAdmin}
                isLive={false}>
                <ConfigContext.Provider value={config}>
                    {children}
                </ConfigContext.Provider>
            </Datastore>
        </SharedDataContext.Provider>
    </InstanceContext.Provider>
}

export function TestInstance({structureKey, siloKey='test', instanceKey='test', screenKey=null, params={}, features={}}) {
    return <WithEnv siloKey={siloKey} structureKey={structureKey} instanceKey={instanceKey} >
        <StackedScreen screenInstance={{structureKey, instanceKey, screenKey, params}} features={features} />
    </WithEnv>
}

export const WithEnv = WithFeatures;

export function DataDumper() {
    console.log('data', global_sharedData.data);
    return <div>{JSON.stringify(global_sharedData.data)}</div>
}

export function getMatchingObject(type, data) {
    const objects = global_sharedData.data[type];
    if (!objects) return false;
    for (let key in objects) {
        if (objectIsSubset(data, objects[key])) return key;
    }
    throw new Error(type + ' not found: ' + JSON.stringify(data));
}

function objectIsSubset(subset, superset) {
    for (let key in subset) {
        if (subset[key] !== superset[key]) return false;
    }
    return true;
}

export function addObject(type, data) {
    global_sharedData.setData({
        ...global_sharedData.data,
        [type]: {
            ...global_sharedData.data[type],
            [data.key]: data
        }
    });
}

export function setGlobal(key, value) {
    global_sharedData.setData({
        ...global_sharedData.data,
        [key]: value
    });
}

export function setModulePublicData({siloKey='test', moduleKey, data}) {
    mock_setFirebaseData(['silo', siloKey, 'module-public', moduleKey], data);
}

export function setFeatures(features) {
    setGlobal('features', features);
}

