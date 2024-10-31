import { StackedScreen, getStructureForKey } from './instance';
import { Datastore, useDatastore } from './datastore';
import { assembleConfig, assembleScreenSet } from './features';
import { mock_setFirebaseData } from './firebase';
import { fireEvent, screen, within, act } from '@testing-library/react';
import { global_textinput_test_handlers } from '../component/text';
import { default_fbUser } from './testpersonas';

export function WithFeatures({dataRef, siloKey='test', structureKey='componentdemo', instanceKey='test', 
        isAdmin=false, features={}, globals, collections, sessionData, personaKey='a', 
        firebaseUser=default_fbUser,
        goBack, pushSubscreen, closeWindow, openUrl, children}) {
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
            firebaseUser={firebaseUser}
            config={config}
            goBack={goBack} closeWindow={closeWindow} openUrl={openUrl}
            pushSubscreen={pushSubscreen}
            isLive={false}>
        {children}
    </Datastore>
}

export function TestInstance({dataRef, structureKey, siloKey='test', instanceKey='test', screenKey=null, 
        params={}, features={}, globals, collections, sessionData, goBack, pushSubscreen}) {
    const structure = getStructureForKey(structureKey);
    const screenSet = assembleScreenSet({structure, activeFeatures:features});
    return <WithEnv dataRef={dataRef} siloKey={siloKey} structureKey={structureKey} instanceKey={instanceKey}
            features={features} globals={globals} collections={collections} sessionData={sessionData} goBack={goBack}
            pushSubscreen={pushSubscreen}
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


async function testStoryActionAsync(parent, action) {
    if (action.action === 'click') {
        await act(async () => {
            await fireEvent.click(await parent.findByTestId(action.matcher))
        });
    } else if (action.action === 'input') {
        const onChangeText = global_textinput_test_handlers[action.matcher];
        await onChangeText(action.text);
    } else if (action.action === 'popup') {
        const popupContent = await parent.findByTestId('popup-content');
        await testStoryActionAsync(within(popupContent), action.popupAction);
    } else if (action.action === 'popup-close') {
        const popupContent = await parent.findByTestId('Close Popup');
        await fireEvent.click(popupContent);
    } else if (action.action === 'check_text') {
        const textFound = parent.getByText(action.expectedText);
        if (!textFound) {
            throw new Error(`Expected text "${action.expectedText}" not found.`);
        }        
    } else {
        throw new Error('Unsupported action: ' + action.action);
    }
}

export async function testStoryActionListAsync(actions) {
    for (let action of actions) {
        await act(async () => {
            await testStoryActionAsync(screen, action);
        });
    }
}