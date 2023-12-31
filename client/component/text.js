import { Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { TranslatableText, useTranslation } from "./translation"
import { colorBannerGreen, colorBlack, colorDisabledText, colorGreyBorder, colorGreyHoverBorder, colorRed, colorTextBlue, colorTextGrey, colorWhite } from "./color";
import { HorizBox, HoverView, Pad } from "./basics";
import { useEffect, useState } from "react";
import { IconCheckmark, IconEdit, IconEditBig } from "./icon";

const fontFamilyMonoRegular = 'IBMPlexMono_400Regular, Courier New, Courier, monospace';
const fontFamilyMonoMedium = 'IBMPlexMono_500Medium, Courier New, Courier, monospace';
const fontFamilyMonoSemiBold = 'IBMPlexMono_600SemiBold, Courier New, Courier, monospace';



export function Heading({text, label, level=2, formatParams}) {
    const styleMap = {
        1: HeadingStyle.heading1,
        2: HeadingStyle.heading2,
    }
    return <TranslatableText text={text} label={label} formatParams={formatParams} 
        style={styleMap[level]} />
}

const HeadingStyle = StyleSheet.create({
    heading1: {
        fontFamily: fontFamilyMonoMedium,
        fontSize: 24,
        lineHeight: 24 * 1.25
    },
    heading2: {
        fontFamily: fontFamilyMonoSemiBold,
        fontSize: 16,
        lineHeight: 16 * 1.25
    },
})

export function Paragraph({type='small', color={colorBlack}, strong=false, text, label, formatParams, underline=false}) {
    const s = ParagraphStyle;
    const styleMap = {
        large: s.largeParagraph,
        small: s.smallParagraph
    }
    return <TranslatableText text={text} label={label} formatParams={formatParams} 
        style={[
            styleMap[type], {color}, 
            strong && {fontFamily: fontFamilyMonoSemiBold},
            underline && {textDecorationLine: 'underline'}
        ]} 
    />
}


const ParagraphStyle = StyleSheet.create({
    largeParagraph: {
        fontSize: 16,
        lineHeight: 16 * 1.5,
        fontFamily: 'IBMPlexMono_400Regular',
    },
    smallParagraph: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        fontFamily: 'IBMPlexMono_400Regular',
    },
})

export function UtilityText({type='small', text, label, formatParams, color='black', strong=false, caps=false, underline=false}) {
    const s = UtilityTextStyle;
    const styleMap = {
        large: s.utilityLarge,
        small: s.utilitySmall,
        tiny: s.utilityTiny,
    }
    const strongMap = {
        large: fontFamilyMonoMedium,
        small: fontFamilyMonoMedium,
        tiny: fontFamilyMonoSemiBold,
    }
    if (!text && !label) return null;
    return <TranslatableText text={text} label={label} formatParams={formatParams}
        style={[
            styleMap[type], {color}, 
            underline && {textDecorationLine: 'underline'},
            strong && {fontFamily: strongMap[type]},
            caps && {textTransform: 'uppercase', letterSpacing: 0.5}
        ]} />
}



const UtilityTextStyle = StyleSheet.create({
    utilityLarge: {
        fontFamily: fontFamilyMonoRegular,
        fontSize: 16,
        lineHeight: 16 * 1.25
    },
    utilitySmall: {
        fontFamily: fontFamilyMonoRegular,
        fontSize: 14, 
        lineHeight: 14 * 1.25
    },
    utilityTiny: {
        fontFamily: fontFamilyMonoMedium,
        fontSize: 12,
        lineHeight: 12 * 1.25,
    }
})

export function LinkText({type='small', text, url, label, formatParams}) {
    const [hover, setHover] = useState(false);

    function onPress() {
        window.open(url, '_blank');
    }

    return <HoverView shrink setHover={setHover} onPress={onPress}>
        <UtilityText type={type} text={text} label={label} formatParams={formatParams} 
            color={colorTextBlue} underline={!hover} />
    </HoverView>
}


export function AutoSizeTextInput({value, onChange, placeholder, style, hoverStyle=null, maxHeight = 400, emptyHeight = 50, ...props}) {
    const [height, setHeight] = useState(0);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (value == '' && height > 0) {
            setHeight(emptyHeight);
        }
    }, [value])

    function onContentSizeChange(e) {
        const newHeight = e.nativeEvent.contentSize.height;
        if (newHeight > height) {
            setHeight(Math.min(newHeight, maxHeight));
        }
    }

    const styleHeight = Math.max(emptyHeight, height);

    return <View style={{height: styleHeight}}>
        <TextInput value={value} onChangeText={onChange} 
            placeholder={placeholder} 
            placeholderTextColor={colorDisabledText}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            multiline={true} 
            style={[style, {height: styleHeight}, hover ? hoverStyle : null]} 
            onContentSizeChange={onContentSizeChange} {...props} />
    </View>
}

export function TextField({value, big=false, autoFocus=false, placeholder, placeholderParams, onChange}) {
    const s = TextFieldStyle;
    const tPlaceholder = useTranslation(placeholder, placeholderParams);
    return <AutoSizeTextInput value={value ?? ''} onChange={onChange} 
        emptyHeight={big ? 300 : 50} autoFocus={autoFocus}
        style={s.textField} hoverStyle={s.hover}
        placeholder={tPlaceholder} placeholderTextColor={colorDisabledText} />
}

const TextFieldStyle = StyleSheet.create({
    textField: {
        borderColor: colorGreyBorder,
        backgroundColor: colorWhite,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 15,
        fontSize: 16,
        fontFamily: 'IBMPlexMono_400Regular',
    },
    hover: {
        borderColor: colorGreyHoverBorder
    }
})

export function TextFieldButton({placeholder, placeholderParams, onPress}) {
    const s = TextFieldButtonStyle;
    const tPlaceholder = useTranslation(placeholder, placeholderParams);
    return <HoverView style={s.textFieldButton} hoverStyle={s.hover} onPress={onPress}>
        <Text style={s.textFieldText}>{tPlaceholder}</Text>
        <IconEditBig />
    </HoverView>
}
const TextFieldButtonStyle = StyleSheet.create({
    textFieldText: {
        color: colorBlack, 
        fontFamily: 'IBMPlexMono_500Medium'
    },
    textFieldButton: {
        borderColor: colorGreyBorder,
        backgroundColor: colorWhite,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 16,
        height: 50,
        fontFamily: 'IBMPlexMono_400Regular',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    hover: {
        borderColor: colorGreyHoverBorder
    }
})

export function TextBanner({label, text, formatParams}) {
    const s = TextBannerStyle;
    return <HorizBox style={s.banner}>
        <UtilityText type='small' text={text} label={label} formatParams={formatParams} />
    </HorizBox>
}
const TextBannerStyle = StyleSheet.create({
    banner: {
        padding: 16,
        backgroundColor: colorBannerGreen,
        borderRadius: 8
    }
});

export function CharacterCounter({max, min, text}) {
    const count = text?.length ?? 0;

    if (count < min) {
        return <UtilityText type='tiny' label='{min} characters min' formatParams={{min}} 
            color={colorDisabledText} />
    } else if (count > max) {
        return <UtilityText type='tiny' label='{max} characters max' formatParams={{max}} 
            color={colorRed} />
    } else {
        return <HorizBox>
            <IconCheckmark />
            <Pad size={8} />
            <UtilityText type='tiny' label='{min} characters min' formatParams={{min}} />
        </HorizBox>
    }
}

export function checkValidLength({text, min, max}) {
    const count = text?.length ?? 0;
    return count >= min && count <= max;
}

