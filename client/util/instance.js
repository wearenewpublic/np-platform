import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TopBar } from '../organizer/TopBar';
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { LoginScreen } from '../organizer/Login';
import { Datastore, WaitForData, useGlobalProperty, useLoaded } from '../util/datastore';
import { SharedData } from '../util/shareddata';
import { useFonts } from 'expo-font';
import { Catcher } from '../component/catcher';
import { structures } from '../structure';
import { ConfigContext, assembleConfig, assembleScreenSet } from './features';
import { useFirebaseData } from './firebase';
import { useIsAdminForSilo } from '../component/admin';

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

export function ScreenStack({url, screenStack, siloKey, structureKey, instanceKey}) {
    const s = ScreenStackStyle;
    
    const structure = getStructureForKey(structureKey);
    const instance = {isLive: true}
    const language = useFirebaseData(['silo', siloKey, 'module-public', 'language'])
    const isAdmin = useIsAdminForSilo({siloKey});

    if (!structureKey || !instanceKey || !siloKey) {
        console.log('ScreenStack missing keys', {structureKey, instanceKey, siloKey});
    }
 
    return <View style={s.stackHolder}>
      <SharedData key={url}>
          <Datastore instance={instance} siloKey={siloKey} instanceKey={instanceKey} structure={structure} structureKey={structureKey} language={language} isAdmin={isAdmin} isLive={true}>
               {screenStack.map((screenInstance, index) => 
                    <StackedScreen screenInstance={screenInstance} index={index} key={index} />
                )}
            </Datastore>
      </SharedData>
    </View>
}
  
const ScreenStackStyle = StyleSheet.create({
    stackHolder: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'white',
    }
})
  


export function StackedScreen({screenInstance, index, features}) {
    const {structureKey, instanceKey, screenKey, params} = screenInstance;
    
    if (structureKey == 'login' || instanceKey == 'login' || screenKey == 'login') {
        return <FullScreen zIndex={index}>
            <TopBar title='Log In' />
            <LoginScreen {...params} />
        </FullScreen>
    }
  
    const structure = getStructureForKey(structureKey);
    const instance = chooseInstanceByKey({structure, instanceKey});
    const activeFeatures = useGlobalProperty('features') || features || [];
    const config = assembleConfig({structure, activeFeatures});
    const screenSet = assembleScreenSet({structure, activeFeatures});
    const loaded = useLoaded();

    var screen = getScreen({screenSet, structure, screenKey, instanceKey});
    var title = getScreenTitle({screenSet, structure, screenKey, instance, params}); 
    const showTopBar = screenKey != 'teaser';
  
    if (!screen) {
        if (loaded) { // Don't show this error waiting for screen set to resolve
            console.error('Screen not found', {loaded, activeFeatures, screenSet, structure: structure, screenKey, instanceKey, screen});
        }
        return null;
    }

    return <FullScreen zIndex={index}>
        <ConfigContext.Provider value={config} >
            {showTopBar && <TopBar title={title} index={index} params={params} subtitle={structure.name} showPersonas={!instance.isLive} />}
            <WaitForData>
                <Catcher>
                    {React.createElement(screen, params)}
                </Catcher>
            </WaitForData>
      </ConfigContext.Provider>
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
  
function getScreenTitle({screenSet, structure, instance, screenKey, params}) {
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
    } else if (instance) {
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
  
function chooseInstanceByKey({structure, instanceKey}) {
    return {isLive: true}
}
  
  