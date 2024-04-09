import { Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { TranslatableText, useTranslation } from "./translation"
import { colorBannerGreen, colorBlack, colorDisabledText, colorGreyBorder, colorGreyHoverBorder, colorRed, colorTextBlue, colorTextGrey, colorWhite } from "./color";
import { HorizBox, HoverView, Pad } from "./basics";
import { useEffect, useState } from "react";
import { IconCheckmark, IconEdit, IconEditBig } from "./icon";

const fontFamilySansRegular = 'IBMPlexSans_400Regular, Arial, Helvetica, sans-serif';
const fontFamilySansMedium = 'IBMPlexSans_500Medium, Arial, Helvetica, sans-serif';
const fontFamilySansSemiBold = 'IBMPlexSans_600SemiBold, Arial, Helvetica, sans-serif';


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
        fontFamily: fontFamilySansMedium,
        fontSize: 24,
        lineHeight: 24 * 1.25
    },
    heading2: {
        fontFamily: fontFamilySansSemiBold,
        fontSize: 16,
        lineHeight: 16 * 1.25
    },
})


export function EditorialHeading({level=1, text, label, underline, formatParams, color='black', italic=false}) {
    const s = EditorialHeadingStyle;
    const styleMap = {
        1: s.heading1,
        2: s.heading2,
        3: s.heading3,
        4: s.heading4,
        5: s.heading5,        
    }    
    return <TranslatableText text={text} label={label} formatParams={formatParams}
        style={[
            styleMap[level], 
            {color}, 
            italic && {fontStyle: 'italic'},
            underline && {textDecorationLine: 'underline'}
        ]} />
}
const EditorialHeadingStyle = StyleSheet.create({
    heading1: {
        fontFamily: fontFamilySansRegular,
        fontSize: 32,
    }, 
    heading2: {
        fontFamily: fontFamilySansRegular,
        fontSize: 28,
    },
    heading3: {
        fontFamily: fontFamilySansRegular,
        fontSize: 24,
    },
    heading4: {
        fontFamily: fontFamilySansRegular,
        fontSize: 20,
    },
    heading5: {
        fontFamily: fontFamilySansRegular,
        fontSize: 18,
    }

})


export function Paragraph({numberOfLines=null, type='small', color={colorBlack}, strong=false, text, label, formatParams, underline=false}) {
    const s = ParagraphStyle;
    const styleMap = {
        large: s.largeParagraph,
        small: s.smallParagraph
    }
    return <TranslatableText numberOfLines={numberOfLines} text={text} label={label} formatParams={formatParams} 
        style={[
            styleMap[type], {color}, 
            strong && {fontFamily: fontFamilySansSemiBold},
            underline && {textDecorationLine: 'underline'}
        ]} 
    />
}


const ParagraphStyle = StyleSheet.create({
    largeParagraph: {
        fontSize: 16,
        lineHeight: 16 * 1.5,
        fontFamily: fontFamilySansRegular,
    },
    smallParagraph: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        fontFamily: fontFamilySansRegular,
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
        large: fontFamilySansMedium,
        small: fontFamilySansMedium,
        tiny: fontFamilySansSemiBold,
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
        fontFamily: fontFamilySansRegular,
        fontSize: 16,
        lineHeight: 16 * 1.25
    },
    utilitySmall: {
        fontFamily: fontFamilySansRegular,
        fontSize: 14, 
        lineHeight: 14 * 1.25
    },
    utilityTiny: {
        fontFamily: fontFamilySansMedium,
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
            /* color={colorTextBlue} */ underline={!hover} />
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
        fontFamily: fontFamilySansRegular,
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
        fontFamily: fontFamilySansMedium
    },
    textFieldButton: {
        borderColor: colorGreyBorder,
        backgroundColor: colorWhite,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 16,
        height: 50,
        fontFamily: fontFamilySansRegular,
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

