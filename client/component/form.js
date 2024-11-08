import React from "react";
import { View } from "react-native";
import { UtilityText } from "./text";
import { Pad } from "./basics";
import { StyleSheet } from "react-native";
import { colorAccent, colorGreyBorder, colorGreyFormHover, colorGreyFormPress, colorGreyHover, colorGreyPopupBackground, colorPurpleBackground, colorRed, colorSecondaryPress, colorTextGrey, colorWhite } from "./color";
import { HorizBox, HoverView, PadBox } from "./basics";
import { ChevronDown, ChevronUp, RadioButton, RadioButtonChecked, CheckboxCheckedFilled, Checkbox as CheckboxOpen } from '@carbon/icons-react';


export function FormField({label, descriptionLabel, errorLabel, required, children}) {
    return <View>
        <HorizBox>
            <UtilityText type='small' weight="medium" label={label} />
            {required && <UtilityText type='small' label='*' color={colorRed} />}
        </HorizBox>
        <Pad size={8} />
        {children}
        {errorLabel && <PadBox top={8}>
            <UtilityText type='small' label={errorLabel} color={colorRed} />
        </PadBox>}
        {descriptionLabel && <PadBox top={8}>
            <UtilityText type='small' label={descriptionLabel} color={colorTextGrey} />
        </PadBox>}
    </View>
}


const RadioContext = React.createContext();

export function RadioGroup({children, value, onChange}) {
    const [radioSelection, setRadioSelection] = React.useState(value);

    function onSetRadio(value) {
        setRadioSelection(value);
        onChange(value);
    }
    return <RadioContext.Provider value={{radioSelection, onSetRadio}}>
        {children}
    </RadioContext.Provider>
}

export function RadioOption({emoji, text, radioKey, label}) {
    const s = RadioItemStyle;
    const {radioSelection, onSetRadio} = React.useContext(RadioContext);
    const value = radioSelection === radioKey;
    return <HoverView hoverStyle={s.hover} pressedStyle={s.pressed} testID={label ?? text}
        onPress={() => onSetRadio(radioKey)} role='checkbox'>
        <PadBox vert={8}>
            <HorizBox center>
                {value ? <RadioButtonChecked size={32} /> : <RadioButton size={32} style={{fill: colorGreyBorder}} />}
                <Pad size={12} />
                {emoji && <PadBox right={6}><UtilityText text={emoji} type='tiny' weight='strong' /></PadBox>}
                <UtilityText text={text} label={label} />
            </HorizBox>
        </PadBox>
    </HoverView>
}
const RadioItemStyle = StyleSheet.create({
    hover: {
        backgroundColor: colorGreyFormHover
    },
    pressed: {
        backgroundColor: colorGreyFormPress    
    }
})


export function Checkbox({emoji, text, label, value, onChange, size=32}) {
    const s = CheckboxStyle;
    return <HoverView hoverStyle={s.hover} pressedStyle={s.pressed} testID={label ?? text}
            onPress={() => onChange(!value)} role='checkbox'>
        <PadBox vert={8}>
            <HorizBox center>
                <View style={{width:size}}>
                    {value ? <CheckboxCheckedFilled size={size} /> : <CheckboxOpen size={size} style={{fill: colorGreyBorder}} />}
                </View>
                <Pad size={12} />
                {emoji && <PadBox right={6}><UtilityText text={emoji} type='tiny' weight='strong' /></PadBox>}
                <UtilityText text={text} label={label} />
            </HorizBox>
        </PadBox>
    </HoverView>
}
const CheckboxStyle = StyleSheet.create({
    hover: {
        backgroundColor: colorGreyFormHover
    },
    pressed: {
        backgroundColor: colorGreyFormPress    
    }
})


export function AccordionField({titleContent, testID, defaultOpen, forceOpen, children}) {
    const s = AccordionFieldStyle;
    const [open, setOpen] = React.useState(defaultOpen);
    return <View>
        <HoverView style={s.titleBar} testID={testID} hoverStyle={s.hover} pressedStyle={s.pressed} onPress={() => setOpen(!open)}>
            <HorizBox center spread>
                {titleContent}
                <Pad />
                {!forceOpen && (open ? <ChevronUp /> : <ChevronDown />)}
            </HorizBox>
        </HoverView>
        {(open || forceOpen) && children}
    </View>

}
const AccordionFieldStyle = StyleSheet.create({
    titleBar: {
        minHeight: 48,
        justifyContent: 'center',
        paddingRight: 16
        // paddingHorizontal: 16
    }, 
    hover: {
        backgroundColor: colorGreyFormHover,
    },
    pressed: {
        backgroundColor: colorGreyFormPress    
    }
});


export function Toggle({emoji, text, label, value, spread, onChange}) {
    const s = ToggleStyle;
    return <HoverView hoverStyle={s.hover} testID={label ?? text}
            onPress={() => onChange(!value)} role='checkbox'>
        <PadBox vert={8}>
            <HorizBox center spread={spread}>        
                    <HorizBox center shrink>
                        {emoji && <PadBox right={8}><UtilityText text={emoji} type='tiny' weight='strong' /></PadBox>}
                        <UtilityText text={text} label={label} />
                    </HorizBox>
                    <Pad size={12} />
                    <View style={value ? s.toggleZoneSelected : s.toggleZone} onPress={() => onChange(!value)}>
                        <View style={value ? s.toggleBallSelected : s.toggleBall} />
                    </View>
            </HorizBox>
        </PadBox>
    </HoverView>
}
const ToggleStyle = StyleSheet.create({
    toggleZone: {
        width: 56,
        height: 32,
        backgroundColor: colorGreyBorder,
        borderRadius: 100,
        transition: 'background-color 0.2s ease-in-out'
    },
    toggleBall: {
        boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.30)',
        elevation: 5,  // for Android,
        position: 'absolute',
        left: 2,
        top: 2,
        width: 28,
        height: 28,
        borderRadius: 100,
        backgroundColor: colorWhite,
        transition: 'left 0.2s ease-in-out, background-color 0.2s ease-in-out'
    },
    toggleZoneSelected: {
        width: 56,
        height: 32,
        backgroundColor: colorPurpleBackground,
        borderRadius: 100,
        transition: 'background-color 0.2s ease-in-out'
    },
    toggleBallSelected: {
        backgroundColor: colorAccent,
        left: 56-28-2,
        top: 2,
        width: 28,
        height: 28,
        borderRadius: 100,
        transition: 'left 0.2s ease-in-out, background-color 0.2s ease-in-out'
    },
    hover: {
        backgroundColor: colorGreyFormHover,
    },
    pressed: {
        backgroundColor: colorGreyFormPress,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,    
    }
})
