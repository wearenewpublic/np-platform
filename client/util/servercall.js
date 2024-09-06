import { useEffect, useState } from "react";
import { getIsLocalhost } from "../platform-specific/url";
import { appApiDomain, localHostApiDomain } from "./config";
import { useDatastore } from "./datastore";
import { getFirebaseIdTokenAsync } from "./firebase";


// TODO: Do user-based authentication, once we have a database
export async function callServerApiAsync({datastore, component, funcname, params}) {
    if (datastore?.getMockServerCall()) {
        return callMockServerApiAsync({datastore, component, funcname, params});
    }

    const idToken = await getFirebaseIdTokenAsync();
    const expandedParams = { 
        siloKey: datastore?.getSiloKey() || null,
        structureKey: datastore?.getStructureKey() || null, 
        instanceKey: datastore?.getInstanceKey() || null,
        language: datastore?.getLanguage() || 'English',
        ...params,
    };
    try {
        const apiUrl = makeApiUrl(component, funcname);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (idToken ?? 'none')
            },
            body: JSON.stringify(expandedParams)
        })
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            console.error('Error in server call', component, funcname, params, result.error);
            return null;
        }
    } catch (error) {
        console.error('Error in fetch', component, funcname, params, error?.message);
    }
}

export async function callMockServerApiAsync({datastore, component, funcname, params}) {
    const mockServerCall = datastore.getMockServerCall();
    if (mockServerCall?.[component]?.[funcname]) {
        return mockServerCall[component][funcname]({datastore, ...params});
    } else {
        throw new Error('No mock server call for ' + component + '/' + funcname);
    }
};


export async function callServerMultipartApiAsync({datastore, component, funcname, params, fileParams={}}) {
    console.log('callMultipartServerApi', component, funcname, params);
    const idToken = await getFirebaseIdTokenAsync();

    const expandedParams = {...params, 
        structureKey: datastore?.getStructureKey() || null, 
        instanceKey: datastore?.getInstanceKey() || null
    };
    try {
        let formData = new FormData();
        Object.keys(expandedParams).forEach(key => {
            formData.append(key, expandedParams[key]);
        })
        Object.keys(fileParams).forEach(key => {
            const {blob, filename} = fileParams[key];
            formData.append(key, blob, filename);
        });

        const apiUrl = makeApiUrl(component, funcname);
        console.log('apiUrl', apiUrl);
        console.log('formData', formData);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + (idToken ?? 'none')
            },
            body: formData,
        })
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            console.error('Error in server call', component, funcname, params, result.error);
            return null;
        }
    } catch (error) {
        console.error('Error in fetch', component, funcname, params, error);
    }
}


export function useServerCallResult(component, funcname, params={}) {
    const datastore = useDatastore();
    const [result, setResult] = useState(null);
    useEffect(() => {
        datastore.callServerAsync(component, funcname, params).then(setResult);
    }, [component, funcname, JSON.stringify(params)]);
    return result;
}


function makeApiUrl(component, funcname) {
    const apiDomain = getIsLocalhost() ? localHostApiDomain : appApiDomain;
    return `${apiDomain}/api/${component}/${funcname}`;
}



