import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TopBar } from '../component/topbar';
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { ConfigContext, Datastore, WaitForData, useDatastore, useGlobalProperty, useIsLive, useLoaded, useSiloKey } from '../util/datastore';
import { useFonts } from 'expo-font';
import { Catcher } from '../system/catcher';
import { structures } from '../structure';
import { assembleConfig, assembleScreenSet } from './features';
import { useFirebaseData, useFirebaseUser } from './firebase';
import { goBack } from './navigate';
import { requireParams } from './util';
import { WithScreenStack } from './params';

export function useStandardFonts() {
    let [fontsLoaded] = useFonts({
        IBMPlexSans_400Regular,
        IBMPlexSans_500Medium,
        IBMPlexSans_600SemiBold,
        IBMPlexMono_400Regular,
        IBMPlexMono_500Medium,
        IBMPlexMono_600SemiBold
    });
    return fontsLoaded
}

function usePersonaPreviewForSilo({siloKey, once=true}) {
    const fbUser = useFirebaseUser();
    const defaultPersonaPreview = {name: fbUser?.displayName, photoUrl: fbUser?.photoURL};
    const personaPreview = useFirebaseData(
        ['silo', siloKey, 'structure', 'profile', 'instance', fbUser?.uid, 'global', 'preview'], 
        {defaultValue: defaultPersonaPreview, once}
    );
    if (!fbUser) return null;
    return personaPreview;
}

export function ScreenStack({url, screenStack, siloKey, structureKey, instanceKey}) {
    const s = ScreenStackStyle;
    
    const structure = getStructureForKey(structureKey);
    if (!structure) {
        throw new Error('Structure not found: ' + structureKey);
    }
    const readOnly = useFirebaseData(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', 'features', 'readonly'], {once: true, defaultValue: false}) ?? true;
    const activeFeatures = useFirebaseData(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', 'features'], {once: readOnly}) || [];
    const config = assembleConfig({structure, activeFeatures});
    const language = useFirebaseData(['silo', siloKey, 'module-public', 'language'], {once: readOnly})
    const screenSet = assembleScreenSet({structure, activeFeatures});
    const personaPreview = usePersonaPreviewForSilo({siloKey, once: readOnly});

    if (!structureKey || !instanceKey || !siloKey) {
        console.error('ScreenStack missing keys', {structureKey, instanceKey, siloKey});
    }

    return <View style={s.stackHolder}>
        <Datastore key={url} siloKey={siloKey} instanceKey={instanceKey} structureKey={structureKey} 
                language={language} isLive={true} config={config} readOnly={readOnly}
                personaPreview={personaPreview}>
            {screenStack.map((screenInstance, index) => 
                <WithScreenStack screenStack={screenStack} index={index} key={index}>
                    <StackedScreen screenSet={screenSet} screenInstance={screenInstance} index={index} />
                </WithScreenStack>
            )}
        </Datastore>
    </View>
}
  
const ScreenStackStyle = StyleSheet.create({
    stackHolder: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'white',
    }
})

export function EmbeddedInstance({structureKey, instanceKey, features, screenKey}) {
    const isLive = useIsLive();
    const siloKey = useSiloKey();
    const datastore = useDatastore();

    const structure = getStructureForKey(structureKey);
    if (!structure) {
        console.error('Structure not found', {structureKey});
    }

    const readOnly = useFirebaseData(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', 'features', 'readonly'], {once: true, defaultValue: false}) ?? true;
    const selectedFeatures = useFirebaseData(['silo', siloKey, 'structure', structureKey, 'instance', instanceKey, 'global', 'features'], {once: readOnly}) || [];
    const activeFeatures = {...selectedFeatures, ...features};
    const config = assembleConfig({structure, activeFeatures});
    const screenSet = assembleScreenSet({structure, activeFeatures});
    const screen = getScreen({screenSet, structure, screenKey, instanceKey});

    if (!isLive) {
        const allInstanceData = datastore.getEmbeddedInstanceData();
        const thisInstanceData = allInstanceData?.[structureKey]?.[instanceKey];
        if (!thisInstanceData) {
            console.error('Embedded instance data not found for test', {allInstanceData, structureKey, instanceKey});
        }
        const extendedInstanceData = {...datastore.props, ...thisInstanceData, config, structureKey, instanceKey, isLive};
        return <Datastore {...extendedInstanceData}>
            {React.createElement(screen)}
        </Datastore>
    } else {        
        return <Datastore siloKey={siloKey} structureKey={structureKey} instanceKey={instanceKey} 
                config={config} isLive={isLive} isEmbedded={true}
                personaPreview={datastore.personaPreview}
                language={datastore.language} readOnly={datastore.readOnly} >
            {React.createElement(screen)}
        </Datastore>
    }
}

export function StructureDemo({
        siloKey='demo', structureKey, instanceKey='demo', screenKey, params={},
        features, isAdmin=true, globals, collections, sessionData, serverCall,
        modulePublic, moduleUserGlobal, moduleUserLocal,
        roles=['Owner'],
        language='english', personaKey='a'
    }) {
    requireParams('StructureDemo', {structureKey});
    const [screenStack, setScreenStack] = React.useState([{siloKey: 'demo', structureKey, instanceKey, screenKey, params}]);

    function pushSubscreen(screenKey, params) {
        setScreenStack([...screenStack, {siloKey: 'demo', structureKey, instanceKey, screenKey, params}]);
    }
    function onGoBack() {
        if (screenStack.length == 1) {
            goBack();
        } else {
            setScreenStack(screenStack.slice(0, screenStack.length-1));
        }
    }

    return <Datastore globals={{...globals, features}} collections={collections} sessionData={sessionData}
                language={language} isAdmin={isAdmin} isLive={false} serverCall={serverCall}
                siloKey={siloKey} structureKey={structureKey} instanceKey={instanceKey} personaKey={personaKey}
                roles={roles} modulePublic={modulePublic} moduleUserGlobal={moduleUserGlobal} moduleUserLocal={moduleUserLocal}
                pushSubscreen={pushSubscreen} goBack={onGoBack} >
            <StructureDemoConfiguredScreenStack structureKey={structureKey} screenStack={screenStack}/>
        </Datastore>
}

// This has to be inside the Datastore, to allow the user to change the 
// features (in the datastore) while playing with the demo.
export function StructureDemoConfiguredScreenStack({structureKey, screenStack}) {
    const s = ScreenStackStyle;

    const activeFeatures = useGlobalProperty('features');
    const structure = getStructureForKey(structureKey);
    const screenSet = assembleScreenSet({structure, activeFeatures});
    const config = assembleConfig({structure, activeFeatures});

    return <View style={s.stackHolder}>
        <ConfigContext.Provider value={config}>
            {screenStack.map((screenInstance, index) =>
                <WithScreenStack screenStack={screenStack} index={index} key={index}>
                    <StackedScreen screenSet={screenSet} screenInstance={screenInstance} index={index} key={index} />
                </WithScreenStack>
            )}  
        </ConfigContext.Provider>
    </View>
}


export function StackedScreen({screenSet, screenInstance, index, features}) {
    const {structureKey, instanceKey, screenKey, params} = screenInstance;
    const loaded = useLoaded();

    const structure = getStructureForKey(structureKey);
    var screen = getScreen({screenSet, structure, screenKey, instanceKey});
    var title = getScreenTitle({screenSet, structure, screenKey, params}); 
    const showTopBar = screenKey != 'teaser';
  
    if (!screen) {
        if (loaded) { // Don't show this error waiting for screen set to resolve
            console.error('Screen not found', {loaded, screenSet, structure: structure, screenKey, instanceKey, screen});
        }
        return null;
    }

    return <FullScreen zIndex={index}>
        {showTopBar && <TopBar title={title} index={index} params={params} subtitle={structure.name} />}
        <WaitForData>
            <Catcher>
                {React.createElement(screen, params)}
            </Catcher>
        </WaitForData>
    </FullScreen>  
  }  

function getScreen({screenSet, structure, screenKey}) {
    if (!screenKey) {
        return structure.screen;
    } else if (screenKey == 'teaser') {
        return structure.teaser;
    } else {
        return screenSet[screenKey];
    }
}
  
function getScreenTitle({screenSet, structure, screenKey, params}) {
    const name = useGlobalProperty('name');
    if (screenKey) {
        const title = screenSet?.[screenKey]?.title;
        if (typeof(title) == 'string') {
            return title;
        } else if (title) {
            return React.createElement(title, params);
        } else {
            return null;
        }
    } else if (name) {
        return name;
    } else {
        return structure.name
    }
}
  
function FullScreen({children, zIndex=0, backgroundColor='white'}) {
    const s = FullScreenStyle;
    return <View style={[s.fullScreen, {zIndex, backgroundColor}]}>{children}</View>
}

const FullScreenStyle = StyleSheet.create({
    fullScreen: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
    }
})
  
  
export function getStructureForKey(key) {
    if (!key) return null;
    return structures.find(structure => structure.key === key);
}
  
  