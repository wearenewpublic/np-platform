import { StyleSheet, View } from "react-native";
import { Heading, UtilityText } from "./text";
import { colorPink, colorPinkBackground } from "./color";
import { Pad, PadBox } from "./basics";

export function TopBanner({rightIcon, children}) {
    const s = TopBannerStyle;
    return <View style={s.topBanner}>
        <View style={s.body}>{children}</View>
        {rightIcon && <View style={s.rightIcon}>{rightIcon}</View>}
    </View>
}
const TopBannerStyle = StyleSheet.create({
    topBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorPinkBackground,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    body: {
        flex: 1
    },
    rightIcon: {
        marginLeft: 10
    }
})


export function Banner({label, text, formatParams, color=colorPink, children}) {
    const s = BannerStyle;
    return <View style={[s.banner, {backgroundColor: color}]}>
        {children} 
    </View>
}
const BannerStyle = StyleSheet.create({
    banner: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8
    }
})