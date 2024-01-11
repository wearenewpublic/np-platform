import { ScrollView, StyleSheet, Text, View } from "react-native"
import { structures } from "../structure"
import { Entypo } from "@expo/vector-icons";
import React, { useState } from 'react'
import { WebLink } from "../platform-specific/url";
import { makeStructureUrl } from "../util/navigate";
import { TextButton } from "../component/button";
import { Heading } from "../component/text";
import { Card, Narrow, Pad, PadBox } from "../component/basics";

export function StructureListScreen() {
    const s = StructureListScreenStyle;
    const sortedStructures = structures.sort((a, b) => new Date(b.date).valueOf() -  new Date(a.date).valueOf());

    function onOpenUrl(url) {
        window.open(url, '_blank');
    }

    return (
        <ScrollView>
            <Narrow>
            <Card>
                <PadBox horiz={20} >
                    <Heading label='New_ Public' />
                    <Heading label='Structure Gardern' />
                </PadBox>
            </Card>
            <PadBox horiz={20}>
                {sortedStructures.map(structure => 
                    <Card key={structure.key}>
                        <Pad />
                        <TextButton key={structure.name} text={structure.name} onPress={() => onOpenUrl(makeStructureUrl(structure.key))} />
                    </Card>
                    // <WebLink key={structure.name} url={makeStructureUrl(structure.key)}>
                    //     <Card>
                    //         <View style={s.authorLine}>
                    //             <SmallTitleLabel label={structure.name}/>
                    //         </View>
                    //         <PreviewText text={structure.description} />
                    //     </Card>
                    // </WebLink>
                )}
            </PadBox>
            </Narrow>
        </ScrollView>
    )
}

const StructureListScreenStyle = StyleSheet.create({
    authorLine: {
        flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4
    },
    extraLine: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8
    }
});
