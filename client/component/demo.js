import { StyleSheet, Text, View } from "react-native";
import { Center, FlowBox, Pad, PadBox, ShadowBox } from "./basics";
import { Catcher } from "./catcher";
import { IconButton, Tag } from "./button";
import { Datastore } from "../util/datastore";
import { global_textinput_test_handlers } from "./text";
import React, { useState } from "react";
import { pauseAsync } from "../util/util";
import { Reset } from "@carbon/icons-react";

export function CLICK(matcher) {
    return {matcher, action: 'click'}
}

export function INPUT(matcher, text) {
    return {matcher, action: 'input', text}
}


export function DemoSection({label, horiz=false, children}) {
    return <View style={{marginBottom: 32}}>
        <DemoHeader label={label} />
        <Pad size={8} />
        <Catcher>
            <SpacedArray horiz={horiz}>{children}</SpacedArray>
        </Catcher>
    </View>
}

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

export function SpacedArray({pad=16, horiz=false, children}) {
    if (children.length > 1) {
        return <View style={horiz ? {flexDirection: 'row', flexWrap: horiz ? 'wrap' : null} : null} >
            {children.map((c, i) => 
                <PadBox key={i} right={horiz ? pad : 0} bottom={pad}><Catcher>{c}</Catcher></PadBox>
            )}
        </View>
    } else {
        return children;
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

export function DemoStorySet({storySet}) {
    const {collections, content, config, globals, sessionData, serverCall} = storySet;
    const domRef = React.createRef();
    const dataRef = React.createRef();
    const [key, setKey] = useState(0);

    function onReset() {
        dataRef.current.resetData();
        setKey(key+1);
    }

    return <Datastore ref={dataRef} config={config} collections={collections} globals={globals}  
            sessionData={sessionData} serverCall={serverCall}>
        <FlowBox>
            {storySet.stories.map(story =>
                <PadBox right={10} key={story.label}>
                    <IconButton compact label={story.label} 
                    onPress={() => playStoryActionListAsync({domRef, actions: story.actions})} />
                </PadBox>
            )}
            <IconButton icon={Reset} compact type='secondary' label='Reset' onPress={onReset} />
        </FlowBox>
        <Pad size={10} />
        <ShadowBox>
            <View key={key}>
                <div ref={domRef}>
                    {content}
                </div>
            </View>
        </ShadowBox>
        <Pad size={32} />
    </Datastore>    
}

