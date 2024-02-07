import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { HoverView } from "../component/basics";

var global_active_popup_closer = null;

export function closeActivePopup() {
    if (global_active_popup_closer) {
        global_active_popup_closer();
    }
}

export function PopupSelector({value, items, onSelect, textStyle={}, paddingVertical=8}) {
    const [hover, setHover] = useState(false)
    return (
        <View style={{marginHorizontal: 0, marginVertical: 0}}>
            <select value={value} onChange={e => onSelect(e.target.value)} 
                onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
                style={{
                    ...textStyle,
                    backgroundColor: 'white', paddingLeft: 8, paddingRight: 8, 
                    paddingTop: paddingVertical, paddingBottom: paddingVertical, borderWidth: 1, 
                    WebkitAppearance: 'none', borderRadius: 8, flex: 1,
                    hover: {borderColor: '#999'},
                    borderColor: hover ? '#999' : '#ddd'
                    }}>
                    {items.map(item => 
                    <option key={item.key} value={item.key}>{item.label}</option>
                    )}
            </select>
        </View>
    )
}



function DocumentLevelComponent({children}) {
    const [container, setContainer] = useState(null);

    useEffect(() => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        setContainer(container);
        return () => {
            document.body.removeChild(container);
        }
    }, []);

    if (!container) return null;

    return ReactDOM.createPortal(
        children,
        container,
    );
}

var global_clickTargetRef = null;
var global_popupRef = null;
var global_popup_align_right = false;

function global_layoutPopup() {
    if (!global_clickTargetRef || !global_popupRef) return;
    if (!global_popupRef.current) {
        requestAnimationFrame(global_layoutPopup);
        return;
    }

    const node  = global_popupRef.current;
    const rect = global_clickTargetRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (rect.top > windowHeight / 2) {
        node.style.top = null;
        node.style.bottom = (windowHeight - rect.top) + 'px';       
    } else {
        node.style.top = rect.bottom + 'px';
        node.style.bottom = null;
    }
    if ((rect.left > windowWidth / 2) || global_popup_align_right) {
        node.style.right = (windowWidth - rect.right) + 'px';
        node.style.left = null;
        node.style.maxWidth = (rect.right - 16) + 'px';
    } else {
        node.style.left = rect.left + 'px';
        node.style.right = null;
        node.style.maxWidth = (windowWidth - rect.left - 16) + 'px';
    }
    requestAnimationFrame(global_layoutPopup);
}


export function Popup({popupContent, popupStyle, alignRight=false, setHover=()=>{}, setShown=()=>{}, children}) {
    const s = PopupButtonStyle;
    const [shown, setLocalShown] = useState(false);
    const popupRef = React.useRef(null);
    const clickTargetRef = React.useRef(null);      

    const closePopup = useCallback(() => {
        setLocalShown(false);
        setShown(false);
    });

    useEffect(() => {
        if (shown) {
            global_active_popup_closer = closePopup;
        } else if (global_active_popup_closer == closePopup) {
            global_active_popup_closer = null;
        }
        return () => {
            if (global_active_popup_closer == closePopup) {
                global_active_popup_closer = null;
            }
        }
    }, [shown])

    function handleClickOutside(event) {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            global_clickTargetRef = null;
            global_popupRef = null;
            setLocalShown(false);
            setShown(false);
        }
    }

    const onClickShow = useCallback(() => {
        setLocalShown(!shown);
        setShown(!shown);        
    })

    useEffect(() => {
        if (shown) {
            global_clickTargetRef = clickTargetRef;
            global_popupRef = popupRef;
            global_popup_align_right = alignRight;
            global_layoutPopup();
        } else {
            global_clickTargetRef = null;
            global_popupRef = null;   
        }
    }, [shown]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
      }, []);

    return <View style={s.frame}>
        <View ref={clickTargetRef}>
            <HoverView onPress={onClickShow} setHover={setHover}>
                {children}
            </HoverView>
        </View> 
        {shown ? 
            <DocumentLevelComponent>
                <View ref={popupRef} style={[s.basicPopup, popupStyle ?? s.popupFrame]} >
                    {shown ? popupContent() : null}
                </View>
            </DocumentLevelComponent>
        : null}
    </View>
}

const PopupButtonStyle = StyleSheet.create({
    frame: {
        position: 'relative'
    },
    basicPopup: {
        position: 'absolute',        
        zIndex: 1000,
    },
    popupFrame: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10,
        boxShadow: '0 4px 4px 0 rgba(85, 85, 85, 0.5',
        backgroundColor: '#fff'
    },
    up: {
        bottom: 0
    },
    down: {
        top: 0
    },
    left: {
        right: 0
    },
    right: {
        left: 0
    }
})

export function PopupIcon({iconFamily, iconName, label=null}) {
    const s = PopupIconStyle;
    return <View style={s.frame}>
        {React.createElement(iconFamily, {name: iconName, size: 24, color: 'white'})}
    </View>
}

const PopupIconStyle = StyleSheet.create({
})