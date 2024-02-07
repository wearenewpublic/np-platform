import React, { useContext } from 'react';

export const InstanceContext = React.createContext({});

export function useInstanceContext() {
    const {structureKey, instanceKey} = useContext(InstanceContext);
    return {structureKey, instanceKey};
}

