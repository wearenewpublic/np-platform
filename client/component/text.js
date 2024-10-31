import { StyleSheet, Text, TextInput, View } from "react-native";
import { TranslatableText, useTranslation } from "./translation";
import { colorBlack, colorDisabledText, colorGreyBorder, colorGreyHover, colorGreyHoverBorder, colorRed, colorWhite } from "./color";
import { HorizBox, HoverView, Pad, PadBox } from "./basics";
import { useEffect, useState } from "react";
import { Edit, Checkmark } from "@carbon/icons-react";
import { usePersonaKey } from "../util/datastore";
import { ProfilePhoto } from "./people";
import { WebLinkBase } from "../platform-specific/url";
import { useConfig } from "../util/features";

const fontFamilySansRegular = 'IBMPlexSans_400Regular, Arial, Helvetica, sans-serif';
const fontFamilySansMedium = 'IBMPlexSans_500Medium, Arial, Helvetica, sans-serif';
const fontFamilySansSemiBold = 'IBMPlexSans_600SemiBold, Arial, Helvetica, sans-serif';
const fontFamilyMonoRegular = 'IBMPlexMono_400Regular, Arial, Helvetica, sans-serif';
const fontFamilyMonoMedium = 'IBMPlexMono_500Medium, Arial, Helvetica, sans-serif';
const fontFamilyMonoSemiBold = 'IBMPlexMono_600SemiBold, Arial, Helvetica, sans-serif'

export function Heading({text, color={color}, center, label, level=2, underline=false, formatParams}) {
    const styleMap = {
        1: HeadingStyle.heading1,
        2: HeadingStyle.heading2,
        3: HeadingStyle.heading3,
        4: HeadingStyle.heading4,
        5: HeadingStyle.heading5,
    }
    return <TranslatableText text={text} label={label} formatParams={formatParams} 
        style={[
            styleMap[level], 
            underline && {textDecorationLine: 'underline'},
            center ? {textAlign: 'center'} : null, {color}
        ]} />
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
    heading3: {
        fontFamily: fontFamilySansMedium,
        fontSize: 14,
        lineHeight: 14 * 1.25
    },
    heading4: {
        fontFamily: fontFamilyMonoRegular,
        fontSize: 12,
        lineHeight: 12 * 1.25,
        fontStyle: 'italic',
    },
    heading5: {
        fontFamily: fontFamilySansRegular,
        fontSize: 14,
        lineHeight: 14 * 1.25,
    },
    
})

export function DataVizText({type, text, label, formatParams}) {
    const s = DataVizTextStyle;
    const styleMap = {
        heading1: s.heading1,
        heading2: s.heading2,
        number: s.number,
        label: s.label,
        labelStrong: [s.label, {fontFamily: fontFamilySansMedium}]
    }
    return <TranslatableText text={text} label={label} formatParams={formatParams}
        style={styleMap[type]} />
}
const DataVizTextStyle = StyleSheet.create({
    heading1: {
        fontFamily: fontFamilySansSemiBold,
        fontSize: 18,
        lineHeight: 18 * 1.25
    },
    heading2: {
        fontFamily: fontFamilyMonoRegular,
        fontSize: 12,
        lineHeight: 12 * 1.25,
        fontStyle: 'italic'
    },
    number: {
        fontFamily: fontFamilyMonoSemiBold,
        fontSize: 12,
        lineHeight: 12 * 1.25
    },
    label: {
        fontFamily: fontFamilyMonoRegular,
        fontSize: 12,
        lineHeight: 12 * 1.25
    }    
})


export function EditorialHeading({type='large', text, label, underline, formatParams, color='black', italic=false}) {
    const s = EditorialHeadingStyle;
    const styleMap = {
        large: s.large,
        small: s.small,        
    }    
    return <TranslatableText text={text} label={label} formatParams={formatParams}
        style={[
            styleMap[type], 
            {color}, 
            italic && {fontStyle: 'italic'},
            underline && {textDecorationLine: 'underline'}
        ]} />
}
const EditorialHeadingStyle = StyleSheet.create({
    large: {
        fontFamily: fontFamilySansRegular,
        fontSize: 24,
    },
    small: {
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



export function UtilityText({type='small', center=false, right=false, text, label, formatParams, color='black', strong=false, caps=false, underline=false, numberOfLines=null, ellipsizeMode='tail'}) {
    const s = UtilityTextStyle;
    const styleMap = {
        large: s.utilityLarge,
        small: s.utilitySmall,
        tiny: caps ? s.utilityTinyCaps : s.utilityTiny,
    }
    const strongMap = {
        large: fontFamilySansMedium,
        small: fontFamilySansMedium,
        tiny: fontFamilySansSemiBold,
    }
    if (!text && !label) return null;
    return <TranslatableText text={text} label={label} formatParams={formatParams}
        numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode}
        style={[
            styleMap[type], {color}, 
            underline && {textDecorationLine: 'underline'},
            strong && {fontFamily: strongMap[type]},
            center && {textAlign: 'center'},
            right && {textAlign: 'right'},
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
    },
    utilityTinyCaps: {
        fontFamily: fontFamilySansRegular,
        fontSize: 12,
        lineHeight: 12 * 1.25,
    }
})

export function WebLink({url, style, setHover, children}) {
    const { openLinksInNewTab } = useConfig();
    return <WebLinkBase 
        newTab={openLinksInNewTab} style={style}
        setHover={setHover} 
        url={url}>
            {children}
    </WebLinkBase>
}

export function LinkText({type='small', testID, text, url, label, formatParams}) {
    return <WebLink url={url} testID={testID}>
        <UtilityText underline type={type} text={text} label={label} formatParams={formatParams} />
    </WebLink>
}

export function WebLinkTextButton({label, text, url, type}) {
    const s = WebLinkTextButtonStyle;
    const [hover, setHover] = useState(false);
    return <WebLink testID={label ?? text} url={url} style={hover ? s.hoverButton : s.button} setHover={setHover}>
        <UtilityText label={label} text={text} type={type} />
    </WebLink>
}
const WebLinkTextButtonStyle = StyleSheet.create({
    button: {
        textDecorationLine: 'none',
    },
    hoverButton: {
        textDecorationLine: 'underline'
    }
})

// HACK: This is a hack to allow the test to access the onChangeText function
// In theory it should be possible to do this with dispatchEvent on the DOM
// node, but that doesn't seem to work in current versions of react-native-web
export var global_textinput_test_handlers = {};

export function AutoSizeTextInput({value, onChange, placeholder, style, hoverStyle=null, maxHeight = 400, emptyHeight = 54, testID, multiline = true, ...props}) {
    const [height, setHeight] = useState(0);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (testID) {
            global_textinput_test_handlers[testID] = onChange;
        }
        return () => {
            if (testID) {
                delete global_textinput_test_handlers[testID];
            }
        }
    }, []);

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
            multiline={multiline} 
            testID={testID}
            style={[style, {height: styleHeight}, hover ? hoverStyle : null]} 
            onContentSizeChange={onContentSizeChange} {...props} />
    </View>
}

export function TextField({value, error=false, big=false, autoFocus=false, placeholder, testID, placeholderParams, onChange, onFocusChange, multiline}) {
    const s = TextFieldStyle;
    const tPlaceholder = useTranslation(placeholder, placeholderParams);
    return <AutoSizeTextInput value={value ?? ''} onChange={onChange} 
        emptyHeight={big ? 300 : 54} autoFocus={autoFocus} testID={testID}
        style={[s.textField, error ? {borderColor: colorRed} : null]} hoverStyle={s.hover}
        placeholder={tPlaceholder} placeholderTextColor={colorDisabledText} 
        onFocus={() => onFocusChange?.(true)} onBlur={() => onFocusChange?.(false)}
        multiline={multiline}/>
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
        lineHeight: 24,
        fontFamily: fontFamilySansRegular,
    },
    hover: {
        borderColor: colorGreyHoverBorder
    }
})

export function TextFieldButton({placeholder, placeholderParams, onPress}) {
    const s = TextFieldButtonStyle;
    const tPlaceholder = useTranslation(placeholder, placeholderParams);
    const personaKey = usePersonaKey();
    return <HoverView style={s.textFieldButton} hoverStyle={s.hover} onPress={onPress}>
        <HorizBox center>
            {personaKey && <PadBox right={10}><ProfilePhoto userId={personaKey} type='small' /></PadBox>}
            <Text style={s.textFieldText}>{tPlaceholder}</Text>
        </HorizBox>
        <Edit size={24} />
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

export function CharacterCounter({max, min, text}) {
    const count = text?.length ?? 0;

    if (count == 0) {
        return <UtilityText type='tiny' label='{min} characters min' formatParams={{min}} 
            color={colorDisabledText} />
    } else if (count < min) {
        return <UtilityText type='tiny' label='{count}/{min} characters min' formatParams={{count,min}} 
            color={colorDisabledText} />
    } else if (count > max) {
        return <UtilityText type='tiny' label='{count}/{max} characters max' formatParams={{count,max}} 
            color={colorRed} />
    } else {
        return <HorizBox>
            <Checkmark />
            <Pad size={8} />
            <UtilityText type='tiny' label='{count}/{max} characters max' formatParams={{count,max}} />
        </HorizBox>
    }
}

export function checkValidLength({text, min, max}) {
    const count = text?.length ?? 0;
    return count >= min && count <= max;
}

export function CircleCount({count}) {
    const s = CircleCountStyle;
    return <View style={s.circle}>
        <UtilityText strong text={String(count)} />
    </View>
}
const CircleCountStyle = StyleSheet.create({
    circle: {
        backgroundColor: colorGreyHover,
        borderRadius: 100,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});