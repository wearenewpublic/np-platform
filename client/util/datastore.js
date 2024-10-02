
import React, { useEffect, useMemo, useState } from 'react';
import { defaultPersonaList, personaListToMap } from './testpersonas';
import { firebaseNewKey, firebaseWatchValue, firebaseWriteAsync, getFirebaseDataAsync, getFirebaseUser, onFbUserChanged, useFirebaseData } from './firebase';
import { deepClone, expandDataListMap, getObjectPropertyPath } from './util';
import { LoadingScreen } from '../component/basics';
import { SharedData, SharedDataContext } from './shareddata';
import { callServerApiAsync } from './servercall';
import { goBack, gotoInstance, pushSubscreen } from './navigate';

const DatastoreContext = React.createContext({});
export const ConfigContext = React.createContext();


// TODO: Make this more efficient: Currently every data update updates everything.

export class Datastore extends React.Component {
    state = {loaded: false}

    // dataTree = {};
    sessionData = {};

    // dataWatchers = [];
    fbUserWatchReleaser = null;
    fbDataWatchReleaser = null;

    constructor(props) {
        super(props);
        this.sharedData = new SharedData();
        this.resetData();
    }

    componentDidMount() {
        this.resetData();
        if (this.props.isLive) {
            this.setupFirebaseWatchers();
        } else {
            this.setState({loaded: true});
        }
    }
    componentWillUnmount() {
        this.fbUserWatchReleaser && this.fbUserWatchReleaser();
        this.fbDataWatchReleaser && this.fbDataWatchReleaser();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.instanceKey != this.props.instanceKey || prevProps.structureKey != this.props.structureKey) {
            this.resetData();
            if (this.props.isLive) {
                this.setupFirebaseWatchers();
            }
        }
    }

    setupFirebaseWatchers() {
        const {siloKey, structureKey, instanceKey} = this.props;
        this.fbUserWatchReleaser && this.fbUserWatchReleaser();
        this.fbDataWatchReleaser && this.fbDataWatchReleaser();

        this.fbDataWatchReleaser = firebaseWatchValue(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey], data => {
            this.setData({...data?.collection, ...data?.global});
            this.setState({loaded: true})
        });
        this.fbWatchReleaser = onFbUserChanged(async user => {
            this.setSessionData('personaKey', user?.uid);
            this.refreshUserDataAsync(user);
        })
    }

    async refreshUserDataAsync(user) {
        if (user) {
            this.setSessionData('roles', null);
            const roles = await this.callServerAsync('admin', 'getMyRoles', {
                email: user?.email
            });
            this.setSessionData('roles', roles);
        } else {
            this.setSessionData('roles', []);
        }
    }

    resetData() {
        const {isLive, globals, collections, sessionData, personaKey='a', roles=[]} = this.props;
        if (isLive) {
            const personaKey = getFirebaseUser()?.uid || null;
            this.sessionData = {personaKey}
            this.refreshUserDataAsync(getFirebaseUser());
        } else {
            this.sessionData = {personaKey, roles, ...sessionData}
            this.setData({
                persona: personaListToMap(defaultPersonaList),
                ...deepClone(globals || {}), 
                ...expandDataListMap(collections || {})
            })
        }
    }

    // Delegate local data storage and notification to SharedDataContext
    // This allows the side-by-side view to work for role play instances.
    static contextType = SharedDataContext;
    watch(watchFunc) {this.sharedData.watch(watchFunc)}
    unwatch(watchFunc) {this.sharedData.unwatch(watchFunc)}
    notifyWatchers() {this.sharedData.notifyWatchers()}
    getData() {return this.sharedData.getData()}
    setData(data) {return this.sharedData.setData(data)}

    setSessionData(path, value) {
        this.sessionData = {...this.sessionData, [pathToName(path)]: value};
        this.notifyWatchers();
    }
    getSessionData(path) {
        return this.sessionData[pathToName(path)];
    }
    getPersonaKey() {
        return this.getSessionData('personaKey');
    }

    getObject(typeName, key) {
        return this.getData()[typeName]?.[key];
    }
    async setObject(typeName, key, value) {
        const {siloKey, structureKey, instanceKey, isLive} = this.props;
        if (!key || !typeName) {
            throw new Error('Missing key or typeName', key, typeName);
        }
        const typeData = {...this.getData()[typeName], [key]: value};
        if (value == null) {
            delete typeData[key]
        }
        this.setData({...this.getData(), [typeName]: typeData});

        if (isLive) {
            if (typeName != 'persona') {
                this.addCurrentUser(); // don't call on persona or you get a loop
            }
            await firebaseWriteAsync(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'collection', typeName, key], value);
            await this.callServerAsync('derivedviews', 'runTriggers', {type: typeName, key});
        }
    }
    addObject(typeName, value) {
        const {isLive} = this.props;
        const key = isLive ? firebaseNewKey() : newLocalKey();
        const personaKey = this.getPersonaKey();
        const objectData = {key, from: personaKey, time: Date.now(), ...value};
        this.setObject(typeName, key, objectData);
        return key;
    }
    modifyObject(typename, key, modFunc) {
        const object = this.getObject(typename, key);
        const newObject = modFunc(object);
        this.setObject(typename, key, newObject);
    }
    updateObject(typename, key, value) {
        const object = this.getObject(typename, key);
        this.addCurrentUser();
        const newObject = {...object, ...value};
        this.setObject(typename, key, newObject);
    }
    addObjectWithKey(typeName, key, value) {
        const personaKey = this.getPersonaKey();
        this.addCurrentUser();
        const objectData = {key, from: personaKey, time: Date.now(), ...value};
        this.setObject(typeName, key, objectData);
        return key;
    }
    deleteObject(typeName, key) {
        this.setObject(typeName, key, null);
    }
    getOrGenerateIndex(typeName, indexFields) {
        const indexName = indexFields.join('-');
        const index = this.sharedData.getIndex(typeName, indexName);
        if (index) {
            return index;
        } else {
            const newIndex = makeIndex(indexFields, this.getData()[typeName]);
            this.sharedData.setIndex(typeName, indexName, newIndex);
            return newIndex;
        }
    }
    getCollection(typeName, props = {}) {
        var items = this.getData()[typeName];
        if (props.filter) {
            const indexFields = Object.keys(props.filter);
            const index = this.getOrGenerateIndex(typeName, indexFields);
            items = lookupFromIndex(indexFields, index, props.filter);
        }
        return sortObjectList(items, props);
    }

    getFirebaseUser() {
        return this.props.firebaseUser ?? getFirebaseUser();
    }

    getPersonaPreview() {
        return this.props.personaPreview;
    }

    addCurrentUser() {
        if (this.props.isLive) {
            const personaKey = this.getPersonaKey();
            const personaPreview = this.getPersonaPreview();
            const myPersona = this.getObject('persona', personaKey);
            if (!myPersona || !myPersona.linked || myPersona.photoUrl != personaPreview.photoURL || myPersona.name != personaPreview.displayName) {
                this.callServerAsync('profile', 'linkInstance');
                this.setObject('persona', personaKey, {...personaPreview, key: personaKey});
            }
        }    
    }

    getGlobalProperty(key) {
        return this.getData()[key];
    }
    setGlobalProperty(key, value) {
        this.setData({...this.getData(), [key]: value});
        
        if (this.props.isLive) {
            this.callServerAsync('global', 'setGlobalProperty', {key, value});
        }
    }
    updateGlobalProperty(key, value) {
        const oldValue = this.getGlobalProperty(key);
        const newValue = {...oldValue, ...value};
        this.setGlobalProperty(key, newValue);
    }
    getModulePublicAsync(moduleKey, path) {
        if (this.props.isLive) {
            return getFirebaseDataAsync(['silo', this.getSiloKey(), 'module-public', moduleKey, ...path]);
        } else {
            return getObjectPropertyPath(this.props.modulePublic, [moduleKey, ...path]);
        }
    }
    async callServerAsync(component, funcname, params={}) {
        if (this.props.onServerCall) {
            this.props.onServerCall({component, funcname, params});
        }
        if (this.props.serverCall) {
            const mockServerCall = this.props.serverCall;
            if (mockServerCall?.[component]?.[funcname]) {
                return await mockServerCall[component][funcname]({datastore: this, ...params});
            } else {
                throw new Error('No mock server call for ' + component + '/' + funcname);
            }
        } else {
            return await callServerApiAsync({datastore: this, component, funcname, params});
        }
    }

    getSiloKey() {return this.props.siloKey ?? (this.props.isLive ? null : 'demo')}
    getStructureKey() {return this.props.structureKey}
    getInstanceKey() {return this.props.instanceKey}
    getConfig() {return this.props.config ?? {}}
    getIsAdmin() {return this.props.isAdmin}
    getIsLive() {return this.props.isLive}
    getLanguage() {return this.props.language}
    getLoaded() {return this.state.loaded}
    getMockServerCall() {return this.props.serverCall}
    pushSubscreen(screenKey, params) {
        if (this.props.pushSubscreen) {
            this.props.pushSubscreen(screenKey, params);
        } else {
            pushSubscreen(screenKey, params);
        }   
    }
    gotoInstance({structureKey, instanceKey='one', params={}}) {
        if (this.props.gotoInstance) {
            this.props.gotoInstance({structureKey, instanceKey, params});
        } else {
            gotoInstance({structureKey, instanceKey, params});
        }
    }
    needsLogin(callback, action) {
        return () => {
            const personaKey = this.getPersonaKey();
            if (personaKey) {
                callback();
            } else {
                this.gotoInstance({structureKey: 'login', instanceKey: 'one', params: {action}});
            }
        }
    }
    goBack() {
        if (this.props.goBack) {
            this.props.goBack();
        } else {
            goBack();
        }
    }
    render() {
        return <DatastoreContext.Provider value={this}>
            <ConfigContext.Provider value={this.props.config ?? {}}>
                {this.props.children}
            </ConfigContext.Provider>
        </DatastoreContext.Provider>
    }
}

export function WaitForData({children}) {
    const loaded = useLoaded();

    if (loaded) {
        return children;
    } else {
        return <LoadingScreen />
    }
}

export function useDatastore() {
    return React.useContext(DatastoreContext);
}


export function useLoaded() {
    const datastore = useDatastore();
    return datastore.getLoaded();
}

export function useData() {
    const datastore = useDatastore();

    const [dataTree, setDataTree] = useState(datastore.getData());
    const [sessionData, setSessionData] = useState(datastore.sessionData);
    useEffect(() => {
        setDataTree(datastore.getData());
        setSessionData(datastore.sessionData);

        const watchFunc = () => {
            setDataTree(datastore.getData());
            setSessionData(datastore.sessionData);
        }
        datastore.watch(watchFunc);
        return () => {
            datastore.unwatch(watchFunc);
        }
    }, [datastore])
    return {dataTree, sessionData};
}

export function usePersonaPreview() {
    const datastore = useDatastore();
    return datastore.getPersonaPreview();
}

export function useSessionData(path) {
    const {sessionData} = useData();
    return sessionData[pathToName(path)];
}

export function usePersonaKey() {
    return useSessionData('personaKey');
}

export function useMyRoles() {
    return useSessionData('roles');
}

export function usePersonaObject(key) {
    const persona = useObject('persona', key);
    const meKey = usePersonaKey();
    const preview = usePersonaPreview();
    const isLive = useIsLive();

    if (key == meKey && isLive && !persona) {
        return {...preview, key};
    } else {
        return persona;
    }
}


export function useObject(typeName, key) {
    const {dataTree} = useData();
    return dataTree[typeName]?.[key];
}

// We have to be careful with memoization here, or we end up creating a new
// result object every time, which messes up dependencies elsehere
export function useCollection(typeName, props = {}) {
    const {dataTree} = useData();
    const datastore = useDatastore();
    const collection = dataTree[typeName];
    // const result = useMemo(() => processObjectList(collection, props),
    //     [collection, JSON.stringify(props)]
    // );
    const result = useMemo(() => datastore.getCollection(typeName, props),
        [collection, JSON.stringify(props)]
    )
    return result;
}

export function useDerivedCollection(typeName, props = {}) {
    return useCollection('derived_' + typeName, props);
}

// TODO: Remove filter from this, since it's done elsewhere
function sortObjectList(collection, {sortBy, reverse, limit}) {
    var result = sortMapValuesByProp(collection ?? [], sortBy || 'key');
    if (reverse) {
        result = result.reverse();
    } if (limit) {
        result = result.slice(0, limit);
    }
    return result;
}

export function useGlobalProperty(key) {
    const {dataTree} = useData();
    return dataTree?.[key];
}

function sortMapValuesByProp(obj, prop) {
    return sortArrayByProp(Object.values(obj), prop);
}

function sortArrayByProp(array, prop) {
    return array.sort((a, b) => {
        const valueA = a[prop];
        const valueB = b[prop];
    
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });
}



var global_nextKey = 0;
export function newLocalKey() {
    global_nextKey++;
    return global_nextKey;
}

export function ensureNextLocalKeyGreater(key) {
    if (typeof(key) == 'number') {
        if (global_nextKey <= key) {
            global_nextKey = key + 1;
        }
    }
}

function pathToName(path) {
    if (typeof(path) == 'string') {
        return path;
    } else {
        return path.join('/');
    }
}

function makeFirebasePath(path) {
    return path.map(encodeURIComponent).join('%2F');
}

export function makeStorageUrl({datastore, userId, fileKey, extension}) {
    const structureKey = datastore.getStructureKey();
    const instanceKey = datastore.getInstanceKey();
    const storagePrefix = 'https://firebasestorage.googleapis.com/v0/b/new-public-demo.appspot.com/o/';
    const path = ['user', userId, structureKey, instanceKey, fileKey + '.' + extension];
    const pathString = makeFirebasePath(path);
    return storagePrefix + pathString + '?alt=media';
}

export function makeIndex(fields, itemMap) {
    var index = {};
    const objectKeys = Object.keys(itemMap || {});
    for (const key of objectKeys) {
        const item = itemMap[key];
        const indexKey = fields.map(field => item[field]).join('-');
        if (!index[indexKey]) {
            index[indexKey] = [];
        }
        index[indexKey].push(item);
    }
    return index;
}

export function lookupFromIndex(fields, index, filter) {
    const key = fields.map(field => filter[field]).join('-');
    return index[key] || [];
}

export function useModulePublicData(moduleKey, path = []) {
    const datastore = useDatastore();
    if (datastore.getIsLive()) {
        return useFirebaseData(['silo', datastore.getSiloKey(), 'module-public', moduleKey, ...path])
    } else {
        return getObjectPropertyPath(datastore.props.modulePublic, [moduleKey, ...path]);
    };
}

export function useInstanceContext() {
    const datastore = useDatastore();
    return {
        structureKey: datastore.structureKey, 
        instanceKey: datastore.instanceKey,
        siloKey: datastore.siloKey
    };
}

export function useSiloKey() {
    const datastore = useDatastore();
    return datastore.getSiloKey();
}

export function useIsLive() {
    const datastore = useDatastore();
    return datastore.getIsLive();
}

export function useInstanceKey() {
    const datastore = useDatastore();
    return datastore.getInstanceKey();
}

export function useStructureKey() {
    const datastore = useDatastore();
    return datastore.getStructureKey();
}