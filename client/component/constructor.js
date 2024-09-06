import { useEffect } from "react";
import { useDatastore, useGlobalProperty, useInstanceKey, useStructureKey } from "../util/datastore";

export function useServersideConstructor() {    
    const initialized = useGlobalProperty('initialized');
    const datastore = useDatastore();
    const instanceKey = useInstanceKey();
    const structureKey = useStructureKey();

    useEffect(() => {
        if (!initialized) {
            datastore.callServerAsync('constructor', 'runConstructor', {
                structureKey, instanceKey
            });
        }
    }, [instanceKey, structureKey]);
    return initialized;
}
