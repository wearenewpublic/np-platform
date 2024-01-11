import React from 'react';
import { Text } from 'react-native';
import { useLiveUrl } from './organizer/url';
import { getScreenStackForUrl, makeUrl } from './util/navigate';
import { ScreenStack, useStandardFonts } from './util/instance';

export default function App() {
  useStandardFonts();
  const url = useLiveUrl();
  const {structureKey, instanceKey, screenStack} = getScreenStackForUrl(url);

  if (!structureKey) {
    const newUrl = makeUrl(['componentdemo', 'demo']);
    return <AppForUrl url={newUrl} />
  } else {
    return <AppForUrl url={url} />
  }
}

function AppForUrl({url}) {
  const {structureKey, instanceKey, screenStack} = getScreenStackForUrl(url);
  if (structureKey && instanceKey) {
    return <ScreenStack url={url} screenStack={screenStack} structureKey={structureKey} instanceKey={instanceKey} />
  } else {
    return <Text>You need a valid space URL to see a space</Text>
  }
}