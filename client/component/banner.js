import { StyleSheet, View } from "react-native";
import { Heading, UtilityText } from "./text";
import { colorBlackHover, colorPink, colorPinkBackground, colorPinkHover, colorPinkPress } from "./color";
import { HorizBox, HoverView, Pad, PadBox } from "./basics";
import { BannerIconButton } from "./button";
import { Information, Close } from '@carbon/icons-react'


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


export function Banner({color=colorPink, children}) {
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

export function ClickableBanner({iconType='info', onPress, color=colorPink, hoverColor=colorPinkHover, pressColor=colorPinkPress, children}) {
    const s = ClickableBannerStyle;
    return <HoverView onPress={onPress}
                style={[s.banner, {backgroundColor: color}]} 
                hoverStyle={{backgroundColor: hoverColor}}
                pressedStyle={{backgroundColor: pressColor}}
            >
        <HorizBox center spread>
            {children}             
            {iconType == 'info' && <Information size={24} style={{fill: colorBlackHover}} />}
            {iconType != 'info' && <Close size={24} style={{fill: colorBlackHover}} />}
        </HorizBox>
    </HoverView>
}
const ClickableBannerStyle = StyleSheet.create({
    banner: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8
    }
})