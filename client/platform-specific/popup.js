import { Text, View } from 'react-native';
import { HoverView } from '../component/basics';
import { useState } from 'react';
import { CTAButton } from '../component/button';

export function PopupSelector({value, items, onSelect}) {
    return <Text>Not yet implemented!</Text>
}

// TODO: This current version is just for running tests.
// We'll need to re-write this for mobile later
export function PopupBase({popupContent, testID, children}) {
    const [expanded, setExpanded] = useState(false);
    function onClose() {setExpanded(false)}
    return <View>
        <HoverView testID={testID} onPress={() => setExpanded(!expanded)}>
            {children}
        </HoverView>
        {expanded && <View testID='popup-content'>
            {popupContent({onClose})}
            <CTAButton onPress={() => setExpanded(false)} label='Close Popup' />
        </View>}
    </View>
}

export function DocumentLevelComponent({children}) {
    return <View>{children}</View>
}   

