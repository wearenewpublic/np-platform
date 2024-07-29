import React from "react";
import { View } from "react-native";
import { UtilityText } from "./text";
import { Pad } from "./basics";
import { StyleSheet } from "react-native";
import { colorAccent, colorGreyBorder, colorGreyHover, colorGreyPopupBackground, colorPurpleBackground, colorRed, colorTextGrey, colorWhite } from "./color";
import { HorizBox, HoverView, PadBox } from "./basics";
import { ChevronDown, ChevronUp, RadioButton, RadioButtonChecked, CheckboxCheckedFilled, Checkbox as CheckboxOpen } from '@carbon/icons-react';


export function FormField({label, descriptionLabel, errorLabel, required, children}) {
    return <View>
        <HorizBox>
            <UtilityText type='small' strong label={label} />
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

export function RadioGroup({children, value, onChange, onSet, onUnSet}) {
    const [radioSelection, setRadioSelection] = React.useState(value);

    function onSetRadio(value) {
        // onUnSet && onUnSet(radioSelection);
        setRadioSelection(value);
        // onSet(value);
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
    return <HoverView hoverStyle={s.hover} pressedStyle={s.pressed}
        onPress={() => onSetRadio(radioKey)} role='checkbox'>
        <PadBox vert={8}>
            <HorizBox center>
                {value ? <RadioButtonChecked size={32} /> : <RadioButton size={32} style={{fill: colorGreyBorder}} />}
                <Pad size={12} />
                {emoji && <PadBox right={6}><UtilityText text={emoji} type='tiny' strong /></PadBox>}
                <UtilityText text={text} label={label} />
            </HorizBox>
        </PadBox>
    </HoverView>
}
const RadioItemStyle = StyleSheet.create({
    hover: {
        backgroundColor: colorGreyPopupBackground
    },
    pressed: {
        backgroundColor: colorGreyHover    
    }
})


export function Checkbox({emoji, text, label, value, onChange}) {
    const s = CheckboxStyle;
    return <HoverView hoverStyle={s.hover} pressedStyle={s.pressed}
            onPress={() => onChange(!value)} role='checkbox'>
        <PadBox vert={8}>
            <HorizBox center>
                {value ? <CheckboxCheckedFilled size={32} /> : <CheckboxOpen size={32} style={{fill: colorGreyBorder}} />}
                <Pad size={12} />
                {emoji && <PadBox right={6}><UtilityText text={emoji} type='tiny' strong /></PadBox>}
                <UtilityText text={text} label={label} />
            </HorizBox>
        </PadBox>
    </HoverView>
}
const CheckboxStyle = StyleSheet.create({
    hover: {
        backgroundColor: colorGreyPopupBackground
    },
    pressed: {
        backgroundColor: colorGreyHover    
    }
})


export function AccordionField({titleContent, defaultOpen, children}) {
    const s = AccordionFieldStyle;
    const [open, setOpen] = React.useState(defaultOpen);
    return <View>
        <HoverView style={s.titleBar} hoverStyle={s.hover} pressedStyle={s.pressed} onPress={() => setOpen(!open)}>
            <HorizBox center spread>
                {titleContent}
                <Pad />
                {open ? <ChevronUp /> : <ChevronDown />}
            </HorizBox>
        </HoverView>
        {open && children}
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
        backgroundColor: colorGreyPopupBackground
    },
    pressed: {
        backgroundColor: colorGreyHover    
    }
});


export function Toggle({emoji, text, label, value, spread, onChange}) {
    const s = ToggleStyle;
    return <HoverView hoverStyle={s.hover}
            onPress={() => onChange(!value)} role='checkbox'>
        <PadBox vert={8}>
            <HorizBox center spread={spread}>        
                    <HorizBox center>
                        {emoji && <PadBox right={8}><UtilityText text={emoji} type='tiny' strong /></PadBox>}
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
        backgroundColor: colorGreyPopupBackground,
    },
    pressed: {
        backgroundColor: colorGreyHover,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,    
    }
})
