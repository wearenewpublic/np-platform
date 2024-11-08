import React from "react";
import { getGlobalParams } from "./navigate";

export const ParamContext = React.createContext();

export function WithScreenStack({url, screenStack, index, children}) {
    const screenParams = screenStack[index].params;
    const instanceParams = screenStack[0].params;
    const globalParams = getGlobalParams(url) ?? {};
    return <ParamContext.Provider value={{globalParams, screenParams, instanceParams}}>
        {children}
    </ParamContext.Provider>
    
}

export function useScreenParams() {
    return React.useContext(ParamContext).screenParams;
}

export function useInstanceParams() {
    return React.useContext(ParamContext).instanceParams;
}

export function useGlobalParams() {
    return React.useContext(ParamContext).globalParams;
}

