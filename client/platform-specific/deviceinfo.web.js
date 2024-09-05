const userAgent = navigator.userAgent || navigator.vendor || window.opera;
const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

export function getIsMobileWeb() {
    return isMobile;
}

export function getDeviceInfo() {
    // Determine the OS
    let os = "Unknown OS";
    if (/windows phone/i.test(userAgent)) {
        os = "Windows Phone";
    } else if (/windows/i.test(userAgent)) {
        os = "Windows";
    } else if (/macintosh|mac os x/i.test(userAgent)) {
        os = "MacOS";
    } else if (/android/i.test(userAgent)) {
        os = "Android";
    } else if (/linux/i.test(userAgent)) {
        os = "Linux";
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        os = "iOS";
    }

    // Determine the browser name and version
    let browserName = "Unknown Browser";
    let browserVersion = "Unknown Version";

    if (/chrome|crios|crmo/i.test(userAgent)) {
        browserName = "Chrome";
        browserVersion = userAgent.match(/(?:chrome|crios|crmo)\/([0-9\.]+)/i)[1];
    } else if (/firefox|fxios/i.test(userAgent)) {
        browserName = "Firefox";
        browserVersion = userAgent.match(/(?:firefox|fxios)\/([0-9\.]+)/i)[1];
    } else if (/safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent)) {
        browserName = "Safari";
        browserVersion = userAgent.match(/version\/([0-9\.]+)/i)[1];
    } else if (/msie|trident/i.test(userAgent)) {
        browserName = "Internet Explorer";
        browserVersion = userAgent.match(/(?:msie |rv:)([0-9\.]+)/i)[1];
    } else if (/edg/i.test(userAgent)) {
        browserName = "Edge";
        browserVersion = userAgent.match(/edg\/([0-9\.]+)/i)[1];
    } else if (/opera|opr/i.test(userAgent)) {
        browserName = "Opera";
        browserVersion = userAgent.match(/(?:opera|opr)\/([0-9\.]+)/i)[1];
    }

    return {
        isMobile, os, browserName, browserVersion,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
    };
}

