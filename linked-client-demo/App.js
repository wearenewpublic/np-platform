import React from 'react';
import { Text } from 'react-native';
import { useLiveUrl } from './organizer/url';
import { getScreenStackForUrl, gotoInstance } from './util/navigate';
import { ScreenStack, useStandardFonts } from './util/instance';

export default function App() {
  useStandardFonts();
  const url = useLiveUrl();
  const {structureKey, instanceKey, screenStack} = getScreenStackForUrl(url);

  if (!structureKey) {
    gotoInstance({structureKey: 'componentdemo', instanceKey: 'demo'});
    return null;
  } else if (structureKey && instanceKey) {
    return <ScreenStack url={url} screenStack={screenStack} structureKey={structureKey} instanceKey={instanceKey} />
  } else {
    return <Text>You need a valid space URL to see a space</Text>
  }
}

