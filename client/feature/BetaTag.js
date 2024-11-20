import React from "react";
import { PadBox } from "../component/basics";
import { colorWhite, colorTextBlue } from "../component/color";
import { UtilityText } from "../component/text";
import { StyleSheet, View } from "react-native"; 

export const BetaTagFeature = {
    name: 'Beta Tag',
    key: 'betatag',
    config: {
        showBetaTag: true,
    }
}

export function BetaTag() {
    return <View style={BetaTagStyle.container}>
        <PadBox horiz={8} vert={2.5}>
        <UtilityText type='tiny' caps weight='medium' label='Beta' color={colorWhite} />
        </PadBox>
    </View>
}

const BetaTagStyle = StyleSheet.create({
    container: {
        backgroundColor: colorTextBlue,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',   
        flexDirection: 'row',         
    }
})