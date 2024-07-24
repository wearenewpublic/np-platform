import { useEffect } from "react";
import { useDatastore, useGlobalProperty, useInstanceKey, useStructureKey } from "../util/datastore";
import { callServerApiAsync } from "../util/servercall";

export function useServersideConstructor() {    
    const initialized = useGlobalProperty('initialized');
    const datastore = useDatastore();
    const instanceKey = useInstanceKey();
    const structureKey = useStructureKey();

    useEffect(() => {
        if (!initialized) {
            callServerApiAsync({datastore, 
                component: 'constructor', funcname: 'runConstructor',
                params: {structureKey, instanceKey}});    
        }
    }, [instanceKey, structureKey]);
    return initialized;
}
