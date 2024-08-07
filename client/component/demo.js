import { StyleSheet, Text, View } from "react-native";
import { Pad, PadBox } from "./basics";
import { Catcher } from "./catcher";

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
