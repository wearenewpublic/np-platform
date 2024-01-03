import { ScrollView, StyleSheet, Text, View } from "react-native"
import { prototypes } from "../structure"
import { Entypo } from "@expo/vector-icons";
import React, { useState } from 'react'
import { WebLink } from "../platform-specific/url";
import { makePrototypeUrl } from "../util/navigate";
import { TextButton } from "../component/button";
import { Heading } from "../component/text";
import { Card, Narrow, Pad, PadBox } from "../component/basics";

export function PrototypeListScreen() {
    const s = PrototypeListScreenStyle;
    const sortedPrototypes = prototypes.sort((a, b) => new Date(b.date).valueOf() -  new Date(a.date).valueOf());

    function onOpenUrl(url) {
        window.open(url, '_blank');
    }

    return (
        <ScrollView>
            <Narrow>
            <Card>
                <PadBox horiz={20} >
                    <Heading label='New_ Public' />
                    <Heading label='Prototype Gardern' />
                </PadBox>
            </Card>
            <PadBox horiz={20}>
                {sortedPrototypes.map(prototype => 
                    <Card key={prototype.key}>
                        <Pad />
                        <TextButton key={prototype.name} text={prototype.name} onPress={() => onOpenUrl(makePrototypeUrl(prototype.key))} />
                    </Card>
                    // <WebLink key={prototype.name} url={makePrototypeUrl(prototype.key)}>
                    //     <Card>
                    //         <View style={s.authorLine}>
                    //             <SmallTitleLabel label={prototype.name}/>
                    //         </View>
                    //         <PreviewText text={prototype.description} />
                    //     </Card>
                    // </WebLink>
                )}
            </PadBox>
            </Narrow>
        </ScrollView>
    )
}

const PrototypeListScreenStyle = StyleSheet.create({
    authorLine: {
        flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4
    },
    extraLine: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8
    }
});
