import { Image, Pressable, StyleSheet, View } from "react-native";
import { Heading, UtilityText } from "./text";
import { HorizBox, Pad, PadBox } from "./basics";
import { RichText } from "./richtext";
import { colorBlack, colorGreyPopupBackground } from "./color";
import { useConfig } from "../util/features";
import { makeAssetUrl } from "../util/util";
import { useDatastore, useModuleUserGlobalData } from "../util/datastore";
import { CloseLarge } from "@carbon/icons-react";


export async function getWillHelpBeSeenAsync({datastore, helpKey}) {
    return await datastore.getModuleUserGlobalAsync('help', [helpKey]);
}

export function HelpBubble({label, text, titleLabel, titleText, padTop=4, above=false, right=false, wide=false, pointer=false, helpKey, condition}) {
    const s  = HelpBubbleStyle;
    const datastore = useDatastore();
    const seenBefore = useModuleUserGlobalData('help', [helpKey]);

    if (!condition || seenBefore || seenBefore === undefined) return null;

    function onClose() {
        datastore.setModuleUserGlobal('help', [helpKey], true);
    }

    const hasTitle = titleLabel || titleText;

    return <View>
        {pointer && <View style={[s.pointer, {top: padTop}]}><UpTriangle /></View>}
        <View style={[
                above ? s.aboveHover : s.belowHover,
                !above ? {top: pointer ? (padTop+10) : padTop} : null
            ]}>
            <View style={[
                    s.bubble, 
                    wide ? null : {maxWidth: 287}, 
                    right ? {alignSelf: 'flex-end'} : null,
                ]}>
                <HorizBox spread>
                    <View style={{flex: 1}}>
                        {hasTitle && <UtilityText type='small' strong 
                            label={titleLabel} text={titleText} 
                            color={colorGreyPopupBackground} 
                        />}
                        {hasTitle && <Pad size={4} />}
                        <UtilityText type={hasTitle ? 'tiny' : 'small'} color={colorGreyPopupBackground} label={label} text={text} />
                    </View>
                    <Pad size={12} />
                    <Pressable onPress={onClose} testID={'close-' + helpKey}>
                        <CloseLarge color={colorGreyPopupBackground} />
                    </Pressable>
                </HorizBox>
            </View>
        </View>
    </View>

}
const HelpBubbleStyle = StyleSheet.create({
    pointer: {
        position: 'absolute',
        left: 20,
        top: 0
    },
    bubble: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: colorBlack
    },
    belowHover: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0
    },
    aboveHover: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0
    }
});

function UpTriangle() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17" fill="none">
        <path d="M10.4202 1.0349C11.2209 0.0035318 12.7791 0.00353236 13.5798 1.0349L23.3515 13.6216C24.3716 14.9356 23.4352 16.8481 21.7717 16.8481L2.22827 16.8481C0.564795 16.8481 -0.37163 14.9356 0.648476 13.6216L10.4202 1.0349Z" fill="#0F0F0F"/>
    </svg>
}


export function NoCommentsHelp() {
    const s = NoCommentsHelpStyle;
    const {noCommentsMessage, noCommentsTitle} = useConfig();
    return <PadBox horiz={20} top={32}>
        <View style={s.helpBox}>
            <Image source={{uri: makeAssetUrl('images/bubbles.png') }}
                style={{width: 58, height: 58}} />    
            <View style={s.right}>
                <Heading level={2} label={noCommentsTitle} />
                <Pad size={4} />
                <RichText label={noCommentsMessage} />
            </View>
        </View>
    </PadBox>
}
const NoCommentsHelpStyle = StyleSheet.create({
    helpBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'centr',
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: colorGreyPopupBackground,
        borderRadius: 8,
    },
    right: {
        marginLeft: 12,
        justifyContent: 'center'
    }
})

