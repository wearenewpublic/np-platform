import { Image, StyleSheet, View } from "react-native";
import { Heading } from "./text";
import { Pad, PadBox } from "./basics";
import { RichText } from "./richtext";
import { colorGreyPopupBackground } from "./color";
import { LinearGradient } from 'expo-linear-gradient';
import { useConfig } from "../util/features";
import { makeAssetUrl } from "../util/util";

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

