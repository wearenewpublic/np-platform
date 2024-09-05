import { StyleSheet, Text, View } from "react-native";
import { Center, FlowBox, Pad, PadBox, ShadowBox } from "./basics";
import { Catcher } from "./catcher";
import { FilterButton, IconButton, Tag } from "./button";
import { Datastore } from "../util/datastore";
import { global_textinput_test_handlers, Heading } from "./text";
import React, { useState } from "react";
import { pauseAsync } from "../util/util";
import { Reset } from "@carbon/icons-react";
import { colorGreyBorder } from "./color";
import { demoPersonaToFbUser, personaA } from "../data/personas";

export function CLICK(matcher) {
    return {matcher, action: 'click'}
}

export function INPUT(matcher, text) {
    return {matcher, action: 'input', text}
}


export function DemoSection({label, horiz=false, children}) {
    const s = DemoSectionStyle;
    return <View style={{marginBottom: 32}}>
        <Heading type='small' label={label} />
        <Pad size={8} />
        <View style={s.box}>
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

export function DemoWidget({text}) {
    return <PadBox bottom={10}><Tag text={text} /></PadBox>
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
    const node = findStoryActionNode({domRef, matcher: action.matcher});
    console.log('playStoryAction', action, node);
    if (action.action === 'click') {
        node.click();
    } else if (action.action === 'input') {
        const onChangeText = global_textinput_test_handlers[action.matcher];
        onChangeText(action.text);
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

export const default_fbUser = demoPersonaToFbUser(personaA);

export const defaultServerCall = {
    eventlog: {
        logEvent: () => {}
    }
}

export function DemoStorySet({storySet}) {
    const { collections, content, structureKey='testStruct', instanceKey='testInstance', 
        personaKey, config, modulePublic,
        globals, sessionData, serverCall, pad=true, firebaseUser=default_fbUser, siloKey='demo'
    } = storySet;
    const domRef = React.createRef();
    const dataRef = React.createRef();
    const [key, setKey] = useState(0);

    function onReset() {
        dataRef.current.resetData();
        setKey(key+1);
    }

    return <Datastore ref={dataRef} config={config} siloKey={siloKey}
            structureKey={structureKey} instanceKey={instanceKey} personaKey={personaKey}
            collections={collections} globals={globals} firebaseUser={firebaseUser}
            sessionData={sessionData} modulePublic={modulePublic}
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
            {storySet.stories && <PadBox vert={5}><IconButton icon={Reset} compact type='secondary' label='Reset' onPress={onReset} /></PadBox>}
        </FlowBox>
        <Pad size={10} />
        <ShadowBox>
            <PadBox horiz={pad ? 20 : 0} vert={pad ? 20 : 0}>
                <View key={key}>
                    <div ref={domRef}>
                        {content}
                    </div>
                </View>
            </PadBox>
        </ShadowBox>
        <Pad size={32} />
    </Datastore>    
}

