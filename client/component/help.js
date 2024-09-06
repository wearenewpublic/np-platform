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
        {/* <PadBox horiz={8} top={24}>
            <SkeletonComment />
            <Pad size={40} />
            <SkeletonComment />
        </PadBox> */}
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

function SkeletonComment() {
    const s = SkeletonCommentStyle;
    return <View style={s.horiz}>
        <SkeletonProfilePicture />
        <Pad size={13} />
        <View style={s.right}>
            <Pad size={13} />
            <SkeletonText width={102}/>
            <Pad size={26} />
            <SkeletonText />
            <Pad size={18} />
            <SkeletonText />
        </View>
    </View>
}
const SkeletonCommentStyle = StyleSheet.create({
    horiz: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    right: {
        flexGrow: 1,
    }
})

function SkeletonProfilePicture() {
    const s = SkeletonProfilePictureStyle;
    return <View style={s.photo}>
    </View>
}
const SkeletonProfilePictureStyle = StyleSheet.create({
    photo: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E9E9E9',
    }
})


function SkeletonText({width}) {
    return <LinearGradient 
        colors={['#E9E9E9', 'rgba(233, 233, 233, 0.20)']} 
        start = {{ x: 0, y: 0 }}
        end = {{ x: 1, y: 0 }}
        style={{height: 6, width}} />
}


// const SkeletonCommentStyle = StyleSheet.create({
// })