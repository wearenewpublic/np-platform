import { StackedScreen, getStructureForKey } from './instance';
import { Datastore, useDatastore } from './datastore';
import { assembleConfig, assembleScreenSet } from './features';
import { mock_setFirebaseData } from './firebase';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { global_textinput_test_handlers } from '../component/text';

export function WithFeatures({dataRef, siloKey='test', structureKey='componentdemo', instanceKey='test', 
        isAdmin=false, features={}, globals, collections, sessionData, personaKey='a', children}) {
    const structure = getStructureForKey(structureKey);
    const config = assembleConfig({structure, activeFeatures:features});
    return <Datastore 
            ref={dataRef}
            siloKey={siloKey}
            structureKey={structureKey}
            instanceKey={instanceKey} 
            isAdmin={isAdmin}
            globals={{...globals, features}}
            collections={collections}
            sessionData={sessionData}
            personaKey={personaKey}
            config={config}
            isLive={false}>
        {children}
    </Datastore>
}

export function TestInstance({dataRef, structureKey, siloKey='test', instanceKey='test', screenKey=null, 
        params={}, features={}, globals, collections, sessionData}) {
    const structure = getStructureForKey(structureKey);
    const screenSet = assembleScreenSet({structure, activeFeatures:features});
    return <WithEnv dataRef={dataRef} siloKey={siloKey} structureKey={structureKey} instanceKey={instanceKey}
            features={features} globals={globals} collections={collections} sessionData={sessionData}
        >
        <StackedScreen screenSet={screenSet} screenInstance={{structureKey, instanceKey, screenKey, params}} features={features} />
    </WithEnv>
}

export const WithEnv = WithFeatures;

export function DumpDatastore() {
    const datastore = useDatastore();
    const data = datastore.getData();
    console.log('Datastore Data:', data);
}


export function getMatchingObject(dataRef, type, data) {
    const objects = dataRef.current.getData()[type];
    if (!objects) {
        console.error('No objects of type', type);
        return false;
    }
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

export function setModulePublicData({siloKey='test', moduleKey, data}) {
    mock_setFirebaseData(['silo', siloKey, 'module-public', moduleKey], data);
}


async function testStoryActionAsync(action) {
    if (action.action === 'click') {
        fireEvent.click(await screen.findByTestId(action.matcher));
    } else if (action.action === 'input') {
        const onChangeText = global_textinput_test_handlers[action.matcher];
        await onChangeText(action.text);
    } else {
        throw new Error('Unsupported action: ' + action.action);
    }
}

export async function testStoryActionListAsync(actions) {
    for (let action of actions) {
        await act(async () => {
            await testStoryActionAsync(action);
        });
    }
}