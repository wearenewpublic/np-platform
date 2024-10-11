import { HorizBox, Pad, PadBox, Separator } from "../component/basics";
import { BreadCrumb } from "../component/button";
import { ScrollView, StyleSheet, View } from 'react-native';
import { DocumentLevelComponent } from "../platform-specific/popup";
import { Close } from '@carbon/icons-react';


export function Modal({children, buttonRow, onClose}) {
    const s = ModalStyle;
    return <DocumentLevelComponent>
        <View style={s.outer} testID="popup-content">
            <View style={s.inner}>
                <HorizBox spread center>
                    <Pad size={56} />
                    <PadBox right={12}><BreadCrumb testID='close-modal' icon={Close} iconProps={{size:32}} onPress={onClose}/></PadBox>
                </HorizBox>
                <Separator />
                <ScrollView>
                    {children}               
                </ScrollView> 
                {buttonRow && <Pad />}
                {buttonRow && <Separator />}
                {buttonRow && <PadBox horiz={20} vert={20}>{buttonRow}</PadBox>}
            </View>
        </View>       
    </DocumentLevelComponent>
}

const ModalStyle = StyleSheet.create({
    outer: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1000
    },
    horiz: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inner: {
        width: '100%',
        height: '100%',
        maxHeight: 600,
        maxWidth: 400,
        borderRadius: 8,
        flex: 1,
        backgroundColor: 'white',
        boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.10)',
    }
});