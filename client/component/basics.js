import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { colorBlueBackgound, colorGreyBorder, colorGreyPopupBackground, colorWhite } from "./color";
import { UtilityText } from "./text";
import { closeActivePopup } from "../platform-specific/popup";
import { Catcher } from "./catcher";

export function Pad({size=20}) {
    return <View style={{height: size, width: size}}/>
}

export function HoverView({style, hoverStyle, pressedStyle, children, disabled=false, onPress, shrink, setHover=()=>{}, setPressed=()=>{}}) {
    const [localHover, setLocalHover] = useState(false);
    const [localPressed, setLocalPressed] = useState(false);
    if (disabled) {
        return <View style={style}>{children}</View>
    }
    return <Pressable
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

export function Card({children}) {
    const s = CardStyle;
    return <View style={s.card}>
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

export function Divider() {
    const s = DividerStyle;
    return <View style={s.divider} />
}
const DividerStyle = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: colorGreyBorder,
    }
});

export function TeaserScreen({children}) {
    function onLayout(e) {
        const {height} = e.nativeEvent.layout;
        console.log('height', height);
        window.parent.postMessage({type: 'psi-teaser-height', height}, '*');
    }
    return <View onLayout={onLayout}>
        {children}
    </View>
}


export function ConversationScreen({children, pad=false}) {
    const s = ConversationScreenStyle;
    return <ScrollView style={s.scroller}>
        <View style={s.outer}>
            <View style={[s.screen, pad ? {paddingHorizontal: 20} : null]}>
                {children}
            </View>
        </View>
    </ScrollView>
}
const ConversationScreenStyle = StyleSheet.create({
    scroller: {
        // backgroundColor: colorBlueBackgound,
        backgroundColor: colorWhite,
        flex: 1,
        overscrollBehavior: 'none'
    },
    outer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colorWhite,
        // backgroundColor: colorBlueBackgound,
        paddingTop: 20,
        flex: 1
    },
    screen: {
        maxWidth: 600,
// h        marginHorizontal: 20,
        flex: 1
    },
})

export function PadBox({children, horiz, vert, top, bottom, left, right}) {
    return <View style={{paddingHorizontal: horiz, paddingVertical: vert, paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right}}>
        {children}
    </View>
}

export function SpacedArray({pad=16, horiz=false, children}) {
    if (children.length > 1) {
        return <View style={horiz ? {flexDirection: 'row'} : null}>
            {children.map((c, i) => <View key={i} style={horiz ? {flexDirection: 'row'} : null}>
                {c}
                {i < children.length - 1 ? <Pad size={pad} /> : null}
            </View>)}
        </View>
    } else {
        return children;
    }
}

export function HorizBox({children, center=false, right=false, spread=false}) {
    return <View style={{
            flexDirection: 'row', 
            alignItems: center ? 'center' : 'flex-start', 
            justifyContent: spread ? 'space-between' : right ? 'flex-end' : 'flex-start'
        }}>
        {children}
    </View>
}

export function LoadingScreen() {
    const s = LoadingScreenStyle;
    return <View style={s.outer}><UtilityText style={s.text} label='Loading...' /></View>
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

export function Clickable({onPress, onHoverChange, children, style, hoverStyle=null}) {
    const [hover, setHover] = useState(false);
    function onPressInner() {
        if (onPress) {
            closeActivePopup();
            onPress();
        }
    }
    function onHover(hover) {
        setHover(hover);
        onHoverChange && onHoverChange(hover);
    }
    return <TouchableOpacity onPress={onPressInner} 
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            style={hover ? [style, hoverStyle] : style} pointerEvents="box-none">
        {children}
    </TouchableOpacity>
}

export function Narrow({children, pad=true}) {
    return <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: pad && 16}}>
        <View style={{maxWidth: 500, flexShrink: 1, flexGrow: 1, marginHorizontal: pad && 8}}>
            {children}
        </View>
    </View>
}

export function Center({children, pad=0}) {
    return <View style={{alignSelf: 'center', alignItems: 'center', margin: pad}}>
        {children}
    </View>  
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

export function Collection({items, renderItem}) {
    const s = CollectionStyle;
    return <View style={s.outer}>
        {items.map((c, i) => <Catcher key={i}>
            {renderItem(c)}
            {i < items.length - 1 ? <PadBox vert={20}><Separator/></PadBox> : null}
        </Catcher>)}
    </View>
}
const CollectionStyle = StyleSheet.create({
    outer: {
        backgroundColor: colorGreyPopupBackground,
        padding: 20,
        borderRadius: 8
    },
    inner: {}
})
