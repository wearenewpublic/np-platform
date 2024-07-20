import { StyleSheet, Text, View } from "react-native";
import { Pad } from "./basics";

export function DemoSection({label, horiz=false, children}) {
    return <View style={{marginBottom: 32}}>
        <DemoHeader label={label} />
        <Pad size={8} />
        <SpacedArray horiz={horiz}>{children}</SpacedArray>
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
        return <View style={horiz ? {flexDirection: 'row'} : null}>
            {children.map((c, i) => <View key={i} style={horiz ? {flexDirection: 'row'} : null}>
                {c}
                {i < children.length - 1 ? <Pad size={pad} /> : null}
            </View>)}
        </View>
    } else {
        return children;
    }
}
