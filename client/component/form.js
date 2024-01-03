import { View } from "react-native";
import { UtilityText } from "./text";
import { Pad } from "./basics";

export function FormField({label, children}) {
    return <View>
        <UtilityText type='tiny' caps label={label} />
        <Pad size={12} />
        {children}
    </View>
}