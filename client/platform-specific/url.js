import { Linking, Pressable } from "react-native";
 
export function historyPushState() {}

export function historyReplaceState() {};

export function historyGetState() {
    return null;
}

export function watchPopState(callback) {}

export function getIsLocalhost() {return false}

export function setTitle() {}

export function WebLinkBase({url, children}) {
    function onPress() {
        Linking.openURL(url);
    }
    return <Pressable style={{flexShrink: 1}} onPress={onPress}>
        {children}
    </Pressable>
}

export function getIsInSidebar() {return false}

export function getFragment() {return ''}
