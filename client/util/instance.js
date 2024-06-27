import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InstanceContext } from '../organizer/InstanceContext';
import { TopBar } from '../organizer/TopBar';
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans'
import { LoginScreen } from '../organizer/Login';
import { Datastore, WaitForData, useGlobalProperty } from '../util/datastore';
import { SharedData } from '../util/shareddata';
import { useFonts } from 'expo-font';
import { Catcher } from '../component/catcher';
import { structures } from '../structure';
import { ConfigContext, assembleConfig } from './features';
import { useLanguage } from '../component/translation';
import { useFirebaseData } from './firebase';

export function useStandardFonts() {
    let [fontsLoaded] = useFonts({
        IBMPlexSans_400Regular,
        IBMPlexSans_500Medium,
        IBMPlexSans_600SemiBold
      });
    return fontsLoaded
}

export function ScreenStack({url, screenStack, siloKey, structureKey, instanceKey}) {
    const s = ScreenStackStyle;
    
    const structure = getStructureForKey(structureKey);
    const instance = {isLive: true}
    const language = useFirebaseData(['silo', siloKey, 'module-public', 'language'])

    if (!structureKey || !instanceKey || !siloKey) {
      console.log('ScreenStack missing keys', {structureKey, instanceKey, siloKey});
    }
 
    return <View style={s.stackHolder}>
      <SharedData key={url}>
        <InstanceContext.Provider value={{structure, siloKey, structureKey, instance, instanceKey, isLive: true}}>
          <Datastore instance={instance} siloKey={siloKey} instanceKey={instanceKey} structure={structure} structureKey={structureKey} language={language} isLive={true}>
            {screenStack.map((screenInstance, index) => 
              <StackedScreen screenInstance={screenInstance} index={index} key={index} />
            )}
          </Datastore>
        </InstanceContext.Provider>
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
    const screenSet = structure.subscreens;
    const activeFeatures = useGlobalProperty('features') || features || [];
    const config = assembleConfig({structure, activeFeatures});
    
    var screen = getScreen({screenSet, structure, screenKey, instanceKey});
    var title = getScreenTitle({screenSet, structure, screenKey, instance, params}); 
    const showTopBar = screenKey != 'teaser';
  
    if (!screen) {
      console.error('Screen not found', {screenSet, structure: structure, screenKey, instanceKey, screen});
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
  
  