import { Platform } from 'react-native';

export function getDeviceInfo() {
    return {
        isMobile: true, 
        os: Platform.OS, 
        browserName: "React Native", 
        browserVersion: Platform.Version
    };
}
