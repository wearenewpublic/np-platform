import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colorAccent, colorAccentHover, colorAccentPress, colorBlack, colorBlackHover, colorDisabledBackground, colorDisabledText, colorGreyBorder, colorGreyHover, colorIconButtonPress, colorLightBlueBackground, colorNearBlack, colorPrimaryPress, colorRed, colorSecondaryPress, colorTextBlue, colorTextGrey, colorWhite } from "./color";
import { EditorialHeading, Heading, Paragraph, UtilityText } from "./text";
import { HorizBox, HoverView, Pad, PadBox } from "./basics";
import { FacePile } from "./people";
import { PopupBase } from "../platform-specific/popup";
import { Information, Close, ChevronDown, ChevronUp } from '@carbon/icons-react';


export function CTAButton({label, text, testID, formatParams, icon, type='primary', disabled, size='large', wide=false, borderless=false, onPress}) {
    const s = CTAButtonStyle;

    const styleMap = {
        primary: {normal: s.primary, hover: s.primaryHover, pressed: s.primaryPressed, textColor: colorWhite}, 
        secondary: {normal: s.secondary, hover: s.secondaryHover, pressed: s.secondaryPressed, textColor: colorBlack},
        accent: {normal: s.accent, hover: s.accentHover, pressed: s.accentPressed, textColor: colorWhite},
        disabled: {normal: s.disabled, hover: s.disabled, pressed: s.disabled, textColor: colorDisabledText},        
        delete: {normal: s.delete, hover: s.deleteHover, pressed: s.deletePressed, textColor: colorRed}
    }
    const {normal, hover, pressed, textColor} = styleMap[disabled ? 'disabled' : type] ?? styleMap.primary;

    const sizeMap = {
        large: s.largeButton,
        compact: s.compactButton,
        small: s.smallButton,
    };    
        
    return <HoverView disabled={disabled} role='button' testID={label ?? text ?? testID}
            style={[sizeMap[size], wide && s.wide, normal, borderless && s.borderless]} hoverStyle={[s.hover, hover]} 
            pressedStyle={pressed} onPress={onPress} >
        {icon && <PadBox right={(label || text) ? (size === 'small' ? 6 : 8) : null}>{icon}</PadBox>}
        <UtilityText type={size === 'small' ? 'tiny' : 'large'} label={label} text={text} formatParams={formatParams} color={textColor} />
    </HoverView>
}

const CTAButtonStyle = StyleSheet.create({
    hover: {
    },
    primary: {
        backgroundColor: colorNearBlack,
        borderColor: colorNearBlack,
    },
    primaryHover: {
        backgroundColor: colorBlackHover,
        borderColor: colorBlackHover,
    },
    primaryPressed: {
        backgroundColor: colorPrimaryPress
    },
    secondary: {
        borderColor: colorGreyBorder,
        backgroundColor: colorWhite,
    },
    secondaryPressed: {
        backgroundColor: colorSecondaryPress,
    },
    secondaryHover: {
        backgroundColor: colorGreyHover,
        borderColor: colorGreyBorder
    },
    accent: {
        backgroundColor: colorAccent,
        borderColor: colorAccentHover
    },
    accentPressed: {
        backgroundColor: colorAccentPress,
    },
    accentHover: {
        backgroundColor: colorAccentHover,
        borderColor: colorAccentHover
    },
    delete: {
        // backgroundColor: colorPink,
        borderColor: colorGreyBorder,
    },
    deletePressed: {
        backgroundColor: colorSecondaryPress,
        borderColor: colorGreyBorder,
    },
    deleteHover: {
        backgroundColor: colorGreyHover,
        borderColor: colorGreyBorder
    },
    disabled: {
        backgroundColor: colorDisabledBackground,
        borderColor: colorDisabledBackground,
        color: colorDisabledText
    },
    largeButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 32,
        alignSelf: 'flex-start',
        borderWidth: 1,
        flexDirection: 'row',
        height: 44, 
        alignItems: 'center',
    },
    compactButton: {
        paddingHorizontal: 12,
        height: 40,
        borderRadius: 32,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1   
    },
    smallButton: {
        paddingHorizontal: 12,
        height: 32,
        borderRadius: 32,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1   
    },
    wide: {
        alignSelf: 'stretch',    
        justifyContent: 'center',
        flex: 1
    },
    borderless: {
        borderWidth: 0
    }
})

export function ClickThroughTag({label, emoji, onPress}) {
    return <CTAButton label={label} icon={emoji && <UtilityText text={emoji} type="small" weight='medium' />}
    type="secondary" size="small" borderless onPress={onPress} />
}

export function IconButton({label, icon=null, iconProps={}, wide=false, onPress}) {
    const s = IconReplyStyle;
    return <HoverView style={[s.button, wide ? s.wide : null]} hoverStyle={s.hover} 
            pressedStyle={s.pressed} onPress={onPress} testID={label} role='button'>
        {icon && React.createElement(icon, iconProps)} 
        {icon && label && <Pad size={8} />}
        <UtilityText label={label} />
    </HoverView>
}
const IconReplyStyle = StyleSheet.create({
    button: {
        flexDirection: 'row',
        height: 32,
        alignItems: 'center',
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
        borderRadius: 32,
        // backgroundColor: colorGreyHover
    },
    wide: {
        alignSelf: 'stretch',
        justifyContent: 'center'
    },  
    hover: {
        backgroundColor: colorGreyBorder,
    },
    pressed: {
        backgroundColor: colorIconButtonPress
    }
});

export function SubtleButton({label, text, ariaLabel, testID, disabled, formatParams, color=colorTextGrey, icon=null, iconProps={}, padLeft, padRight, onPress}) {
    const s = SubtleButtonStyle;
    const [hover, setHover] = useState(false);
    return <HoverView style={[s.button, padLeft && {marginLeft: 20}, padRight && {marginRight: 20}]} 
            disabled={disabled} role={!disabled ? 'button' : null}
            ariaLabel={ariaLabel} testID={testID ?? label ?? text ?? ariaLabel}
            onPress={onPress} setHover={setHover}>
        {React.createElement(icon, {...iconProps, color})}
        {(label || text) && <Pad size={4} />}
        <UtilityText label={label} text={text} weight={'medium'} underline={hover} 
            color={color} formatParams={formatParams} type='small' />
    </HoverView>
}
const SubtleButtonStyle = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});


export function TextButton({label, text, type='large', heading=false, paragraph=false, editorial=false, underline, strong, italic, formatParams, leftIcon, leftIconProps={}, rightIcon, rightIconProps={}, color=colorBlack, alignStart=false, onPress}) {
    const s = TextButtonStyle;
    const [hover, setHover] = useState(false);
    return <HoverView shrink testID={label ?? text}
            style={[s.button, alignStart ? {alignSelf: 'flex-start'} : null]}
            setHover={setHover} onPress={onPress} role='button'>
        {leftIcon && React.createElement(leftIcon, {...leftIconProps, color})}
        {leftIcon && <Pad size={8} />}        
        {paragraph ? 
            <Paragraph label={label} text={text} formatParams={formatParams} type={type}
                color={color} underline={hover ^ underline} strong={strong} />
        : editorial ?
            <EditorialHeading type={type} label={label} text={text} formatParams={formatParams}
                color={color} underline={hover ^ underline} italic={italic} strong={strong} />
        : heading ?
            <Heading label={label} text={text} formatParams={formatParams} type={type}
                color={color} underline={hover ^ underline} weight={strong ? 'medium' : 'regular'} />
        :
            <UtilityText label={label} text={text} formatParams={formatParams} type={type} 
                color={color} underline={hover ^ underline} weight={strong ? 'medium' : 'regular'} />
        }
        {rightIcon && <Pad size={8} />}
        {rightIcon && React.createElement(rightIcon, {...rightIconProps, color})}
    </HoverView>
}
const TextButtonStyle = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export function TextLinkButton({label, text, type='large', paragraph=false, editorial=false, underline, strong, italic, formatParams, leftIcon, rightIcon, color=colorBlack, alignStart=false, onPress}) {
    const [hover, setHover] = useState(false);
    return <HoverView shrink style={[alignStart ? {alignSelf: 'flex-start'} : null]} setHover={setHover} onPress={onPress} role='button' testID={label ?? text}>
        {leftIcon && React.createElement(leftIcon, {color})}
        {leftIcon && <Pad size={8} />}        
        {paragraph ? 
            <Paragraph label={label} text={text} formatParams={formatParams} type={type}
                color={color} underline={hover ^ underline} strong={strong} />
        : editorial ?
            <EditorialHeading type={type} label={label} text={text} formatParams={formatParams} 
                color={color} underline={hover ^ underline} italic={italic} strong={strong} />
        :
            <UtilityText label={label} text={text} formatParams={formatParams} type={type} 
                color={color} underline={hover ^ underline} strong={strong} />
        }
        {rightIcon && <Pad size={8} />}
        {rightIcon && React.createElement(rightIcon, {color})}
    </HoverView>
}



export function ExpandButton({
        userList, photoUrlList, label, text, type='small', 
        formatParams, expanded, setExpanded=()=>{},
        testID,
    }) {
    const s = ExpanderButtonStyle;
    const [hover, setHover] = useState(false);

    return <HoverView style={s.button} setHover={setHover} role='button'
            onPress={() => setExpanded(!expanded)} testID={testID ?? label ?? text}>        
        {userList && <FacePile type={type} userIdList={userList} />}
        {photoUrlList && <PhotoPile photoUrlList={photoUrlList} />}
        {(userList || photoUrlList) && <Pad size={4} />}
        <UtilityText label={label} text={text} formatParams={formatParams} type={type} 
            underline={hover} weight='medium' />
        <Pad size={4} />
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </HoverView>

}
const ExpanderButtonStyle = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export function Tag({label, emoji, text, type='emphasized', strong=false, formatParams, color=null, onPress, compact=false, dashed=false, borderColor=null}) {
    const s = TagStyle;
    return <View style={[
                s.button, 
                type == 'emphasized' && s.emphasized, 
                type == 'tiny' && s.tiny,      
                color && {borderColor: borderColor || color, backgroundColor: color},
                compact && {height: 28},
                dashed && {borderStyle: 'dashed'}
            ]} 
            hoverStyle={s.hover} onPress={onPress}>
        {emoji && <PadBox right={6}><UtilityText text={emoji} type='small' weight='medium' /></PadBox>}
        <UtilityText color={type=='tiny' ? colorTextBlue : null} 
            label={label} text={text} formatParams={formatParams} 
            type='small' weight='medium' />
    </View>
}
const TagStyle = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderRadius: 4,
        height: 32,
        // borderColor: 'red',
        borderColor: colorGreyBorder
    },
    emphasized: {
        borderRadius: 100,
    },
    tiny: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 100,
        height: 20,
        backgroundColor: colorLightBlueBackground,
        borderColor: colorLightBlueBackground
    }
})

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
        alignSelf: 'flex-start',     
    }
})

export function ReactionButton({emoji, viewOnly=false, label, text, count, selected, onPress}){
    const s = ReactionButtonStyle;
    const [pressed, setPressed] = useState(false);
    return <HoverView style={[s.horiz, !viewOnly && s.button, selected && s.pressed]} 
            hoverStyle={s.hover} disabled={viewOnly} testID={label ?? text}
            pressedStyle={s.pressed} setPressed={setPressed} role='button' onPress={onPress}>
        {emoji && <PadBox right={8}><UtilityText text={emoji} type='small' weight='medium' /></PadBox>}
        <UtilityText label={label} text={text} type='small' weight='medium'/>
        {count ? <Pad size={8} /> : null}
        <UtilityText text={count} type='small' weight='medium' color={colorRed} />
    </HoverView>
}
const ReactionButtonStyle = StyleSheet.create({
    horiz: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewOnly: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colorGreyBorder,
    },
    hover: {
        backgroundColor: colorGreyHover,
    },
    pressed: {
        borderColor: colorBlack,        
        backgroundColor: colorWhite
    }
})

export function FilterButton({emoji, label, text, count, selected, onPress}) {
    const s = FilterButtonStyle;
    const [pressed, setPressed] = useState(false);

    return <HoverView style={[s.button, selected && s.pressed]} pressedStyle={s.pressed} hoverStyle={s.hover} 
            onPress={onPress} setPressed={setPressed} testID={label ?? text}>
        {emoji && <PadBox right={8}><UtilityText text={emoji} type='small' weight='medium' /></PadBox>}
        <UtilityText label={label} text={text} type='small' weight='medium'/>
        {count ? <Pad size={8} /> : null}
        <UtilityText text={count} type='small' weight='medium' color={colorRed} />
    </HoverView>
}
const FilterButtonStyle = StyleSheet.create({
    button: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderColor: colorGreyBorder,
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 12
    },
    hover: {
        backgroundColor: colorGreyHover,
    },
    pressed: {
        borderColor: colorBlack,        
        backgroundColor: colorWhite,
    }
});

export function DropDownSelector({label, options, value, onChange=()=>{}}) {
    const [hover, setHover] = useState(false);
    const selectedOption = options.find(o => o.key == value) || options[0];
    function popupContent({onClose}) {
        return <View >
            {options.map((o, i) => <View key={i}>
                {i != 0 && <Pad size={20} />}
                <TextButton label={o.label} type='tiny' onPress={() => {onChange(o.key); onClose()}} />
            </View>)}
        </View>
    }
    return <PopupPanel popupContent={popupContent} alignRight setHover={setHover}>
        <HorizBox>
            <UtilityText label={label} type='tiny' weight='strong' />
            <UtilityText text=': ' type='tiny' weight='strong' />
            <UtilityText label={selectedOption.label} type='tiny' underline={hover} weight='strong' />
        </HorizBox>
    </PopupPanel>
}

export function PopupPanel({children, popupContent, alignRight=false, testID, setHover}) {
    const s = PopupPanelStyle;
    const [shown, setShown] = useState(false);
    return <View style={{alignSelf: 'flex-start'}}> 
        <PopupBase testID={testID} popupContent={popupContent} alignRight={alignRight} setHover={setHover} setShown={setShown}>
            <View style={s.button}>
                {children}
                <Pad size={8} />
                {shown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </View>        
        </PopupBase>
    </View>
}

const PopupPanelStyle = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
    }
})

// Need to have this here rather than in platform-specific, because it's hard for 
// other components to import from platform-specific
export function Popup(params) {
    return <PopupBase {...params}/>
}


export function BannerIconButton({type, testID, onPress}) {
    const s = BannerIconButtonStyle;
    const icon = type == 'close' ? Close : Information;
    return <HoverView style={s.regular} hoverStyle={s.hover} 
        pressedStyle={s.pressed} onPress={onPress} testID={testID}>
        {React.createElement(icon, {size: 24})}
    </HoverView>
}

const BannerIconButtonStyle = StyleSheet.create({
    regular: {
        width: 24,
        height: 24,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hover: {
        backgroundColor: colorGreyHover
    },
    pressed: {
        backgroundColor: colorIconButtonPress
    }
})


export function BreadCrumb({icon, testID, iconProps={}, onPress}) {
    const s = BreadCrumbStyle;
    return <HoverView style={s.regular} hoverStyle={s.hover} 
        pressedStyle={s.pressed} onPress={onPress} testID={testID}>
        {React.createElement(icon, iconProps)}
    </HoverView>
}

const BreadCrumbStyle = StyleSheet.create({
    regular: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hover: {
        backgroundColor: colorGreyHover
    },
    pressed: {
        backgroundColor: colorIconButtonPress
    }
})


export function PhotoPile({photoUrlList}) {
    const s = PhotoPileStyle;
    if (photoUrlList.length == 0) return null;
    if (photoUrlList.length == 1) {
        return <Image style={s.singlePhoto} source={{uri: photoUrlList[0]}} />
    } else if (photoUrlList.length == 2) {
        return <View style={s.outer}>
            <Image style={[s.twoPhoto, {left: 0, top: 0}]} source={{uri: photoUrlList[0]}} />
            <Image style={[s.twoPhoto, {right: 0, bottom: 0}]} source={{uri: photoUrlList[1]}} />
        </View>
    } else if (photoUrlList.length == 3) {
        return <View style={s.outer}>
            <Image style={[s.threePhoto, {left: 0, top: 0}]} source={{uri: photoUrlList[0]}} />
            <Image style={[s.threePhoto, {left: 6, top: 6}]} source={{uri: photoUrlList[1]}} />
            <Image style={[s.threePhoto, {right: 0, bottom: 0}]} source={{uri: photoUrlList[2]}} />
        </View>
    }
}
const PhotoPileStyle = StyleSheet.create({
    outer: {
        width: 32,
        height: 32
    },
    singlePhoto: {
        width: 32,
        height: 32,
        marginRight: 4
    },
    twoPhoto: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: colorWhite
    },
    threePhoto: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: colorWhite
    },
})
