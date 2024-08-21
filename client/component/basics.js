import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { colorBlueBackground, colorGreyBorder, colorGreyPopupBackground, colorPinkBackground, colorWhite } from "./color";
import { UtilityText } from "./text";
import { closeActivePopup } from "../platform-specific/popup";
import { Catcher } from "./catcher";
import { setTitle } from "../platform-specific/url";
import { Banner } from "./banner";

export function Pad({size=20}) {
    return <View style={{height: size, width: size}}/>
}

// Note: react-testing-library only supports DOM events, so we can't test hover events right now
export function HoverView({style, ariaLabel, testID, role, hoverStyle, pressedStyle, children, disabled=false, onPress, shrink, setHover=()=>{}, setPressed=()=>{}}) {
    const [localHover, setLocalHover] = useState(false);
    const [localPressed, setLocalPressed] = useState(false);
    if (disabled || !onPress) {
        return <View style={style}>{children}</View>
    }
    return <Pressable
        role={role}
        aria-label={ariaLabel}
        testID={testID}
        style={[style, localHover ? hoverStyle : null, localPressed ? pressedStyle : null, shrink ? {flexShrink: 1} : null]}
        onPressIn={() => {setLocalPressed(true); setPressed(true)}}
        onPressOut={() => {setLocalPressed(false); setPressed(false)}}
        onPress={onPress}
        onHoverIn={() => {setLocalHover(true); setHover(true)}}
        onHoverOut={() => {setLocalHover(false); setHover(false)}}
        >
            {children}
    </Pressable>
}

export function Card({testID, children}) {
    const s = CardStyle;
    return <View style={s.card} testID={testID}>
        {children}
    </View>
}
const CardStyle = StyleSheet.create({
    card: {
        paddingBottom: 20,
        backgroundColor: colorWhite,
        borderBottomColor: colorGreyBorder,
        borderBottomWidth: 1
    }
});

export function TeaserScreen({children}) {
    function onLayout(e) {
        const {height} = e.nativeEvent.layout;
        window.parent.postMessage({type: 'psi-teaser-height', height}, '*');
    }
    return <View onLayout={onLayout}>
        {children}
    </View>
}


export function ConversationScreen({children, pad=false}) {
    const s = ConversationScreenStyle;
    const hasEmulateWarning = window.location.hostname == 'localhost';
 
    return <ScrollView style={s.scroller}>
        <View style={s.outer}>
            <View style={[s.screen, pad ? {paddingHorizontal: 20} : null]}>
                {children}
            </View>
        </View>
        {hasEmulateWarning && <Pad size={36} />}
    </ScrollView>
}
const ConversationScreenStyle = StyleSheet.create({
    scroller: {
        backgroundColor: colorWhite,
        flex: 1,
        overscrollBehavior: 'none'
    },
    outer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colorWhite,
        flex: 1
    },
    screen: {
        maxWidth: 600,
        flex: 1
    },
})

export function PadBox({children, horiz, vert, top, bottom, left, right}) {
    return <View style={{paddingHorizontal: horiz, paddingVertical: vert, paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right}}>
        {children}
    </View>
}

export function HorizBox({children, center=false, shrink=false, right=false, spread=false}) {
    return <View style={{
            flexDirection: 'row', 
            alignItems: center ? 'center' : 'flex-start', 
            justifyContent: spread ? 'space-between' : right ? 'flex-end' : 'flex-start',
            flexShrink: shrink ? 1 : 0
        }}>
        {children}
    </View>
}

export function WrapBox({children, center=false, stretch=false, right=false, spread=false}) {
    const s = WrapBoxStyle;
    return <View style={s.box}>
        {children}
    </View>
}
const WrapBoxStyle = StyleSheet.create({
    box: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
})        



export function LoadingScreen({label = 'Loading...'}) {
    const [show, setShow] = useState(false);
    const s = LoadingScreenStyle;

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 1000);
        return () => clearTimeout(timeout);
    }, []);

    if (show) {
        return <View style={s.outer}>
            {/* <UtilityText style={s.text} label={label} /> */}
            <Banner color={colorBlueBackground}><UtilityText label={label} /></Banner>
        </View>
    } else {
        return null;
    }
}
const LoadingScreenStyle = StyleSheet.create({
    outer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#666'
    }
});

export function Narrow({children, pad=true}) {
    return <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: pad && 16}}>
        <View style={{maxWidth: 600, flexShrink: 1, flexGrow: 1, marginHorizontal: pad && 8}}>
            {children}
        </View>
    </View>
}

export function Center({children, pad=0}) {
    return <View style={{alignSelf: 'center', alignItems: 'center', margin: pad}}>
        {children}
    </View>  
}

export function HeaderBox({children, backgroundColor=colorPinkBackground, horiz=20, vert=20}) {
    return <View style={{paddingHorizontal:horiz, paddingVertical:vert, backgroundColor}}>{children}</View>
}

export function Separator() {
    const s = SeparatorStyle;
    return <View style={s.separator} />
}
const SeparatorStyle = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: colorGreyBorder,
    }
});

export function WindowTitle({title}) {
    setTitle(title);
    return null;
}

// HACK: Bump the key to force a re-render, otherwise the old hover state is preserved when the component is unselected
export function HoverSelectBox({selected, onPress, children}) {
    const s = HoverSelectBoxStyle;
    const [key, setKey] = useState(0);
    function onLocalPress() {
        onPress();
        setKey(key+1)
    }
    return <HoverView key={key} onPress={onLocalPress} disabled={!onPress || selected} style={s.outline} hoverStyle={s.hover}>
        {children}
    </HoverView>
}
const HoverSelectBoxStyle = StyleSheet.create({
    hover: {
        borderColor: colorGreyBorder,
        borderWidth: 1,
        borderRadius: 8,
        padding: 0,
        boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.10)',
    },
    outline: {
        borderColor: colorGreyBorder,
        borderWidth: 1,
        borderRadius: 8,
        padding: 0
    }
})

export function ShadowBox({children}) {
    const s = ShadowBoxStyle;
    return <View style={s.shadow}>{children}</View>
}

const ShadowBoxStyle = StyleSheet.create({
    shadow: {
        boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.10)',
        borderRadius: 12
    }
})

export function FlowBox({children, center=false}) {
    return <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start'}}>
        {children}
    </View>
}

export function Container({children}) {
    const s = ContainerStyle;
    return <View style={s.outer}>
        {children}
    </View>
}

const ContainerStyle = StyleSheet.create({
    outer: {
        borderColor: colorGreyBorder,
        borderWidth: 1,
        borderRadius: 12,
    }
});
