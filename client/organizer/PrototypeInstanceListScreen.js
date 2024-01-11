
import { ScrollView, Switch, Text, View } from "react-native"
import { useState } from "react";
import { useFirebaseData, useFirebaseUser } from "../util/firebase";
import { Heading, UtilityText } from "../component/text";
import { Card, HorizBox, Narrow, Pad, PadBox } from "../component/basics";
import { CTAButton, TextButton } from "../component/button";

export function StructureInstanceListScreen({structure, onSelectInstance}) {
    const firebaseUser = useFirebaseUser();
    const [split, setSplit] = useState(structure.split);
    // const userInstanceMap = useFirebaseData(['structure', structure.key, 'userInstance', firebaseUser?.uid], {});
    const userInstanceMap = useFirebaseData(['userInstance', firebaseUser?.uid, structure.key], {});
    const userInstanceList = Object.entries(userInstanceMap || {}).map(([key, value]) => ({key, ...value}));
    const sortedUserInstances = userInstanceList.sort((a, b) => b.createTime - a.createTime);
    function onToggleSplit() {
        structure.split = !split;
        setSplit(!split);
    }
    return <ScrollView>
            <Narrow>
                <Card>
                    <Heading text={structure.name}/>
                </Card>
                <Pad />
                {structure.instance ?
                    <View>
                        <Heading label='Role Play Instances' />
                        <PadBox horiz={20} top={20}>
                            {structure.instance.map(instance => (
                                <TextButton key={instance.key} text={instance.name} onPress={() => onSelectInstance(instance.key)} />
                            ))}      
                        </PadBox>
                    </View>
                : null}
                {structure.newInstanceParams ?
                    <PadBox vert={20}>
                        <Heading label='Your Live Instances'/>
                        <PadBox horiz={20} vert={20}>
                        {sortedUserInstances.map(instance => (
                            <TextButton key={instance.key} text={instance.name} onPress={() => onSelectInstance(instance.key)} />
                        ))}      
                        {userInstanceMap == null ? 
                            <UtilityText label='Loading...' />
                        : null}
                        </PadBox>
                        <PadBox horiz={16}><CTAButton label='New Live Instance' onPress={() => onSelectInstance('new')} /></PadBox>
                    </PadBox>
                : null}            
            </Narrow>
            <Pad size={16} />
    </ScrollView>
}

// function SplitToggle({split, onToggle}) {
//     return <HorizBox center>
//         <Pad size={12} />
//         <Text>Split Screen</Text>
//         <Pad size={8} />
//         <Switch value={split} onValueChange={onToggle} />
//     </HorizBox>
// }