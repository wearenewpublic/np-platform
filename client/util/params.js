import React from "react";

export const ParamContext = React.createContext();

export function WithScreenStack({screenStack, index, children}) {
    const screenParams = screenStack[index].params;
    const instanceParams = screenStack[0].params;
    return <ParamContext.Provider value={{screenParams, instanceParams}}>
        {children}
    </ParamContext.Provider>
    
}

export function useScreenParams() {
    return React.useContext(ParamContext).screenParams;
}

export function useInstanceParams() {
    const context = React.useContext(ParamContext);
    return React.useContext(ParamContext).instanceParams;
}
