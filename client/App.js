import React, { useTransition } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { structures } from './structure';
import { InstanceContext } from './organizer/InstanceContext';
import { StructureInstanceListScreen } from './organizer/StructureInstanceListScreen';
import { StructureListScreen } from './organizer/StructureListScreen';
import { TopBar } from './organizer/TopBar';
// import { useFonts, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono'
import { getIsLocalhost, setTitle } from './platform-specific/url';
import { useLiveUrl } from './organizer/url';
import { getScreenStackForUrl, gotoStructure, gotoInstance } from './util/navigate';
import { LoginScreen } from './organizer/Login';
import { Datastore, WaitForData, useGlobalProperty } from './util/datastore';
import { NewLiveInstanceScreen } from './organizer/NewLiveInstance';
import { SharedData } from './util/shareddata';
import { useFonts } from 'expo-font';
import { Catcher } from './component/catcher';
import { AdminScreen } from './component/admin';


export default function App() {
  const url = useLiveUrl();
  const {structureKey, instanceKey, screenStack} = getScreenStackForUrl(url);
  const structure = chooseStructureByKey(structureKey);
  const instance = structure && instanceKey && chooseInstanceByKey({structure, instanceKey});

  let [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold
  });

  console.log('fontsLoaded', fontsLoaded);

  function onSelectInstance(newInstanceKey) {
    gotoInstance({structureKey, instanceKey: newInstanceKey});
  }

  if (window.NEWPUBLIC_CONFIG) {
    return <EmbeddedStructure />
  } else if (!structureKey) {
    return <FullScreen>
      <Text>You need a structure URL to see a structure</Text>
    </FullScreen>
  } else if (structureKey == 'all' && getIsLocalhost()) {
    setTitle('Structure Organizer')
    return <FullScreen >
      <StructureListScreen onSelectStructure={newStructure => gotoStructure(newStructure.key)}/>
    </FullScreen>
  } else if (!structure) {
    return <FullScreen>
      <TopBar title='Unknown Structure' />
      <Text>Unknown structure: {structureKey}</Text>
    </FullScreen>
  } else if (!instanceKey) {
    return <FullScreen >
          {/* <TopBar title={structure.name} showBack={false} /> */}
          <StructureInstanceListScreen structure={structure} onSelectInstance={onSelectInstance}/>
    </FullScreen>
  } else if (instanceKey == 'new') {
    return <FullScreen >
      <TopBar title='New Live Instance' subtitle={structure.name} />
      <NewLiveInstanceScreen structure={structure} />
    </FullScreen>
  } else {
    return <SharedData key={url}>
      <ScreenStack screenStack={screenStack} structureKey={structureKey} instanceKey={instanceKey} />
    </SharedData>
  }
}


export function EmbeddedStructure() {
  const config = window.NEWPUBLIC_CONFIG;
  const {instanceKey} = config;
  const structureKey = config.structure;
  const structure = chooseStructureByKey(config.structure);
  const instance = chooseInstanceByKey({structure, instanceKey: config.instanceKey});
  const screenSet = {...defaultScreens, ...structure.subscreens};
  const screenKey = null;
  const params = {};

  console.log('config', {config, structure, instance});

  return <SharedData>
    <InstanceContext.Provider value={{structure, structureKey, instance, instanceKey, isLive: instance.isLive}}>
      <Datastore instance={instance} instanceKey={instanceKey} structure={structure} structureKey={structureKey} isLive={instance.isLive}>
        <EmbeddedStructureScreen instance={instance} instanceKey={instanceKey} structure={structure} structureKey={structureKey} screenKey={screenKey} params={params} />
      </Datastore>
    </InstanceContext.Provider>
  </SharedData>
  // return <BodyText>Embedded Structure</BodyText>
}

function EmbeddedStructureScreen({instance, instanceKey, structure, structureKey, screenKey, params}) {
  const screenSet = {...defaultScreens, ...structure.subscreens};
  var screen = getScreen({screenSet, structure, screenKey, instanceKey});
  var title = getScreenTitle({screenSet, structure, screenKey, instance, params}); 

  return React.createElement(screen, params);
}



function SideBySideStack({screenStack, structureKey, instanceKey}) {
  const s = SideBySideStackStyle;
  return <View style={s.outer}>
    <View style={s.column}>
      <View style={s.columnInner}>   
        <ScreenStack screenStack={screenStack} structureKey={structureKey} instanceKey={instanceKey} />
      </View>
    </View>
    <View style={s.column}>
      <View style={s.columnInner}>
        <ScreenStack screenStack={screenStack} structureKey={structureKey} instanceKey={instanceKey} />
      </View>
    </View>
  </View>
}

const SideBySideStackStyle = StyleSheet.create({
  outer: {
    flex: 1, 
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 2,
    shadowRadius: 4, shadowColor: '#555', shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5, elevation: 1,
    backgroundColor: 'white'
  },
  columnInner: {
    flex: 1,
    borderRadius: 16
  },
})


function ScreenStack({screenStack, structureKey, instanceKey}) {
  const s = ScreenStackStyle;

  console.log('screen stack', screenStack);

  const prototype = chooseStructureByKey(structureKey);
  const instance = chooseInstanceByKey({prototype, instanceKey});
  return <View style={s.stackHolder}>
    <InstanceContext.Provider value={{prototype, structureKey, instance, instanceKey, isLive: instance.isLive}}>
      <Datastore instance={instance} instanceKey={instanceKey} prototype={prototype} structureKey={structureKey} isLive={instance.isLive}>
        {screenStack.map((screenInstance, index) => 
          <StackedScreen screenInstance={screenInstance} index={index} key={index} />
        )}
      </Datastore>
    </InstanceContext.Provider>
  </View>
}

const ScreenStackStyle = StyleSheet.create({
  stackHolder: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
  }
})


function StackedScreen({screenInstance, index}) {
  const {structureKey, instanceKey, screenKey, params} = screenInstance;

  if (structureKey == 'login' || instanceKey == 'login' || screenKey == 'login') {
    return <FullScreen zIndex={index}>
        <TopBar title='Log In' />
        <LoginScreen {...params} />
    </FullScreen>
  }

  const prototype = chooseStructureByKey(structureKey);
  const instance = chooseInstanceByKey({prototype, instanceKey});
  const screenSet = {...defaultScreens, ...prototype.subscreens};

  var screen = getScreen({screenSet, prototype, screenKey, instanceKey});
  var title = getScreenTitle({screenSet, prototype, screenKey, instance, params}); 
  const showTopBar = screenKey != 'teaser';

  if (!screen) {
    console.error('Screen not found', {screenSet, prototype, screenKey, instanceKey, screen});
    return null;
  }

  return <FullScreen zIndex={index}>
    {showTopBar && <TopBar title={title} index={index} params={params} subtitle={prototype.name} showPersonas={!instance.isLive} />}
    <WaitForData>
      <Catcher>
        {React.createElement(screen, params)}
      </Catcher>
    </WaitForData>
  </FullScreen>  
}


const defaultScreens = {
  admin: () => <AdminScreen />
}

function getScreen({screenSet, prototype, screenKey}) {
  if (!screenKey) {
    return prototype.screen;
  } else if (screenKey == 'teaser') {
    return prototype.teaser;
  } else {
    return screenSet[screenKey];
  }
}

function getScreenTitle({screenSet, prototype, instance, screenKey, params}) {
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
    return prototype.name
  }
}

function FullScreen({children, zIndex=0, backgroundColor='white'}) {
  return <View style={[AppStyle.fullScreen, {zIndex, backgroundColor}]}>{children}</View>
}

const AppStyle = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    // backgroundColor: 'white',
  }
})

function chooseStructureByKey(key) {
  if (!key) return null;
  return prototypes.find(prototype => prototype.key === key);
}

function chooseInstanceByKey({prototype, instanceKey}) {
  if (!instanceKey) {
    return null;
  }
  const rolePlayInstance = prototype.instance?.find(instance => instance.key === instanceKey);
  if (rolePlayInstance) {
    return rolePlayInstance;
  } else {
    const liveInstance = prototype.liveInstance?.find(instance => instance.key === instanceKey);
    return {...liveInstance, isLive: true};
  }
}


