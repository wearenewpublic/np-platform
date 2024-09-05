import { Platform } from 'react-native';


export function getIsMobileWeb() {
    return false;
}

export function getDeviceInfo() {
    return {
        isMobile: true, 
        os: Platform.OS, 
        browserName: "React Native", 
        browserVersion: Platform.Version
    };
}
