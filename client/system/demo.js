import { StyleSheet, Text, View } from "react-native";
import { Center, FlowBox, Pad, PadBox, ShadowBox } from "../component/basics";
import { Catcher } from "./catcher";
import { FilterButton, IconButton, Tag } from "../component/button";
import { Datastore } from "../util/datastore";
import { global_textinput_test_handlers, Heading, UtilityText } from "../component/text";
import React, { useState } from "react";
import { keysToTrueMap, pauseAsync } from "../util/util";
import { Reset } from "@carbon/icons-react";
import { colorBlueBackground, colorGreyBorder, colorGreyPopupBackground, colorTextGrey, colorWhite } from "../component/color";
import { default_fbUser, demoPersonaToFbUser, personaA } from "../util/testpersonas";
import { Banner } from "../component/banner";
import { closeActivePopup, getPopupRef } from "../platform-specific/popup.web";
import { assembleConfig } from "../util/features";
import { getStructureForKey } from "../util/instance";

export function CLICK(matcher) {
    return {matcher, action: 'click'}
}

export function INPUT(matcher, text) {
    return {matcher, action: 'input', text}
}

export function POPUP(popupAction) {
    return {action: 'popup', popupAction}
}

export function POPUP_CLOSE() {
    return {action: 'popup-close'}
}

export function CHECK_TEXT(expectedText) {
    return { action: 'check_text', expectedText };
}


export function DemoSection({label, horiz=false, children, color=null}) {
    const s = DemoSectionStyle;
    return <View style={{marginBottom: 32}}>
        <Heading type='small' label={label} />
        <Pad size={8} />
        <View style={[s.box, color && {backgroundColor: color}]}>
            <Catcher>
                <SpacedArray horiz={horiz}>{children}</SpacedArray>
            </Catcher>
        </View>
    </View>
}
const DemoSectionStyle = StyleSheet.create({
    box: {
        borderColor: colorGreyBorder,
        borderWidth: 1,
        borderRadius: 12,
        padding: 20,
        paddingBottom: 0
    }
});

export function DemoHeader({label}) {
    const s = DemoHeaderStyle;
    return <Text style={s.header}>{label}</Text>
}
const DemoHeaderStyle = StyleSheet.create({
    header: {
        fontFamily: 'sans-serif',
        fontSize: 24,
        lineHeight: 32
    }
})

export function SpacedArray({pad=20, horiz=false, children}) {
    if (children.length > 1) {
        return <View style={horiz ? {flexDirection: 'row', flexWrap: horiz ? 'wrap' : null} : null} >
            {children.map((c, i) => 
                <PadBox key={i} right={horiz ? pad : 0} bottom={pad}><Catcher>{c}</Catcher></PadBox>
            )}
        </View>
    } else {
        return <View>
            {children}
            <Pad size={pad} />
        </View>
    }
}

export function DemoWidget({color, text}) {
    return <PadBox bottom={10}><Tag color={color} text={text} /></PadBox>
}

export function DemoPageWidget({text}) {
    return <PadBox bottom={10} top={20}>
        <Center>
            <Tag text={text} />
        </Center>
    </PadBox>
}

function findStoryActionNode({domRef, matcher}) {
    if (typeof matcher === 'string') {
        return domRef.current.querySelector('[data-testid="' + matcher + '"]');
    } else {
        throw new Error('Unsupported matcher type: ' + matcher);
    }
    return domRef;
}

async function playStoryAction({domRef, action}) {
    console.log('playStoryAction', action, domRef);

    if (action.action === 'popup') {
        const popup = document.body.querySelector(['[data-testid="popup-content"]']);
        return await playStoryAction({domRef: {current: popup}, action: action.popupAction});
    } else if (action.action === 'popup-close') {
        return closeActivePopup();
    }
    
    const node = findStoryActionNode({domRef, matcher: action.matcher});
    if (!node) {
        throw new Error('Node not found: ' + action.matcher);
    } else if (action.action === 'click') {
        node.click();
    } else if (action.action === 'input') {
        const onChangeText = global_textinput_test_handlers[action.matcher];
        onChangeText(action.text);
    } else if (action.action == 'popup') {
        await playStoryAction({domRef: getPopupRef(), action: action.popupAction});
    } else if (action.action === 'check_text') {
        const textFound = domRef.current?.textContent.includes(action.expectedText);
        if (!textFound) {
            throw new Error(`Expected text "${action.expectedText}" not found.`);
        }   
    } else {
        throw new Error('Unsupported action: ' + action.action);
    }
}

async function playStoryActionListAsync({domRef, actions}) {
    for (let action of actions) {
        await playStoryAction({domRef, action});
        await pauseAsync(500);
    }
    await pauseAsync(500);
}

export const defaultServerCall = {
    eventlog: {
        logEvent: () => {}
    }
}

export function DemoStorySet({storySet}) {
    const { collections, content, structureKey='testStruct', instanceKey='testInstance', 
        personaKey, config, modulePublic, moduleUserGlobal, moduleUserLocal, roles, features, embeddedInstanceData,
        globals, sessionData, serverCall, pad=true, firebaseUser=default_fbUser, siloKey='demo',
        urlFragment
    } = storySet;
    const domRef = React.createRef();
    const dataRef = React.createRef();
    const [key, setKey] = useState(0);
    const [navInstance, setNavInstance] = useState(null);
    const [callLog, setCallLog] = useState([]);
    function onServerCall(call) {
        setCallLog(oldLog => [...oldLog, call]);
    }
    var featureConfig = null;
    if (features) {
        if (!storySet.structureKey) {
            throw new Error('Structure key required for feature config');
        }
        const structure = getStructureForKey(structureKey);
        if (!structure) {
            throw new Error('Structure not found: ' + structureKey);
        }
        featureConfig = assembleConfig({
            structure, activeFeatures: keysToTrueMap(features), 
            includeDefaults: false
        });
    }

    function onReset() {
        dataRef.current.resetData();
        setNavInstance(null);
        setKey(key+1);
        setCallLog([]);
    }

    return <Datastore ref={dataRef} config={featureConfig ?? config} siloKey={siloKey}
            structureKey={structureKey} instanceKey={instanceKey} personaKey={personaKey}
            collections={collections} globals={globals} firebaseUser={firebaseUser}
            sessionData={sessionData} modulePublic={modulePublic} 
            moduleUserGlobal={moduleUserGlobal} moduleUserLocal={moduleUserLocal}
            embeddedInstanceData={embeddedInstanceData}
            roles={roles} onServerCall={onServerCall}
            gotoInstance={setNavInstance} 
            goBack={() => setNavInstance({parent: true})}
            openUrl={url => setNavInstance({url})} urlFragment={urlFragment}
            closeWindow={() => setNavInstance({close: true})}
            pushSubscreen={(screenKey,params) => setNavInstance({screenKey, params})}
            serverCall={{...defaultServerCall, ...serverCall}} >
        <Heading type='small' text={storySet.label} />
        <Pad size={5} />
        <FlowBox>
            {storySet.stories?.map(story =>
                <PadBox right={10} vert={5} key={story.label}>
                    <FilterButton label={story.label} 
                        onPress={() => playStoryActionListAsync({domRef, actions: story.actions})} />
                </PadBox>
            )}
            <PadBox vert={5}><IconButton icon={Reset} compact type='secondary' label='Reset' onPress={onReset} /></PadBox>
        </FlowBox>
        <Pad size={10} />
        <ShadowBox>
            <PadBox horiz={pad ? 20 : 0} vert={pad ? 20 : 0}>
                {navInstance && <NavResult navInstance={navInstance} /> }
                <View key={key}>
                    <div ref={domRef}>
                        {content}
                    </div>
                </View>
                {callLog.length > 0 && <ServerCallLog callLog={callLog} />}
            </PadBox>
        </ShadowBox>
        <Pad size={32} />
    </Datastore>    
}

export function NavResult({navInstance}) {
    return <PadBox horiz={8} vert={8}>
        <Banner>
            <UtilityText text='Navigated to:' />
            {navInstance.close && <UtilityText strong text='Close window' />}
            {navInstance.url && <UtilityText strong text={navInstance.url} />}
            {navInstance.parent && <UtilityText strong text='Parent screen' />}
            {navInstance.structureKey && <UtilityText strong text={navInstance.structureKey + '/' + navInstance.instanceKey} />}
            {navInstance.screenKey && <UtilityText strong text={'Subscreen: ' + navInstance.screenKey + '(' + JSON.stringify(navInstance.params) + ')'} />}
            {navInstance.token && <UtilityText strong text={'Login token: ' + navInstance.token} />}
        </Banner>
    </PadBox>
}

export function ServerCallLog({callLog}) {
    const s = ServerCallLogStyle;
    return <View style={s.callList}>
        {callLog.map((call, i) => 
            <UtilityText type='tiny' color={colorTextGrey} key={i} text={call.component + '.' + call.funcname + '(' + JSON.stringify(call.params) +')'} />
        )}
    </View>
}

const ServerCallLogStyle = StyleSheet.create({
    callList: {
        backgroundColor: colorGreyPopupBackground,
        padding: 6,
        marginTop: 16,
        borderColor: colorGreyBorder,
        borderWidth: 1,
     }
})
