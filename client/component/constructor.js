import { useEffect } from "react";
import { useInstanceContext } from "../organizer/InstanceContext";
import { useDatastore, useGlobalProperty } from "../util/datastore";
import { callServerApiAsync } from "../util/servercall";

export function useServersideConstructor() {    
    const {structureKey, instanceKey} = useInstanceContext();
    const initialized = useGlobalProperty('initialized');
    const datastore = useDatastore();

    useEffect(() => {
        if (!initialized) {
            console.log('initializing instance', {structureKey, instanceKey})
            callServerApiAsync({datastore, component: 'constructor', funcname: 'runConstructor', params: {structureKey, instanceKey}});    
        }
    }, [instanceKey, structureKey]);
    return initialized;
}