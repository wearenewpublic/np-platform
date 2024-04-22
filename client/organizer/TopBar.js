import { StyleSheet, Text, View } from "react-native";
import { PersonaSelector } from "./PersonaSelector";
import { closeSidebar, goBack, gotoInstance, gotoStructure, pushSubscreen } from "../util/navigate";
import { firebaseSignOut, useFirebaseUser } from "../util/firebase";
import { Popup } from "../platform-specific/popup";
import { useDatastore, useGlobalProperty, usePersonaKey, useSessionData } from "../util/datastore";
import { useContext, useEffect, useState } from "react";
import { InstanceContext } from "./InstanceContext";
import { IconChevronDown, IconChevronDownSmall, IconChevronUpSmall, IconClose, IconCloseBig, IconLeftArrowBig, IconSettings } from "../component/icon";
import { Byline, FaceImage } from "../component/people";
import { BreadCrumb, CTAButton, TextButton, Toggle } from "../component/button";
import { HorizBox, Pad, PadBox, Separator } from "../component/basics";
import { emailIsAdmin } from "../util/config";
import { colorGreyHover, colorGreyPopupBackground, colorTextGrey, colorWhite } from "../component/color";
import { ObservableProvider, ObservableValue, useObservable } from "../util/observable";
import { getAvailableFeaturesForStructure } from "../util/features";
import { callServerApiAsync } from "../util/servercall";
import { defaultFeatureConfig } from "../feature";
import { Catcher } from "../component/catcher";
import { historyGetState } from "../platform-specific/url";
import { useIsAdmin } from "../component/admin";

const global_toolbarAction = new ObservableValue(null);

export function TopBar({showPersonas}) {
    const s = TopBarStyle;
    const {instance, instanceKey} = useContext(InstanceContext);
    const toolbarAction = useObservable(global_toolbarAction);
    return <View style={s.topBox}>        
        <View style={s.leftRow}>    
            {historyGetState() ? 
                <BreadCrumb icon={IconLeftArrowBig} onPress={goBack} />
            : 
                <BreadCrumb icon={IconCloseBig} onPress={closeSidebar} />
            }
        </View>
        <Catcher>
            <HorizBox center>
                {toolbarAction ? 
                    <PadBox right={12}><CTAButton compact label={toolbarAction.label} disabled={toolbarAction.disabled} onPress={toolbarAction.onPress} /></PadBox>
                : showPersonas ? 
                    <PersonaSelector />
                : 
                    instanceKey && <UserInfo />
                }
            </HorizBox>
        </Catcher>
    </View>
}

const TopBarStyle = StyleSheet.create({
    topBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16, 
        justifyContent: 'space-between',
        borderBottomColor: '#ddd', 
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: 'white',
        height: 56
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1
    },
    oneLineTitle: {
        fontSize: 18, fontWeight: 'bold',
        marginVertical: 8,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    twoLineTitle: {
        fontSize: 15, fontWeight: 'bold',
        flexShrink: 1
    },
    subtitle: {
        fontSize: 13, color: '#666'
    },
    titleBox: {
        marginVertical: 2,
        marginLeft: 4,
        flexShrink: 1
    }
})


export function FeatureToggles() {
    const {structure, structureKey} = useContext(InstanceContext);
    const features = getAvailableFeaturesForStructure(structureKey)
    const defaultFeatures = defaultFeatureConfig[structureKey] ?? {};
    if (!features) return null;
    return <PadBox top={20}>
        <Separator />
        <Pad/>
        {features.map(feature => 
            <FeatureToggle key={feature.key} defaultState={defaultFeatures[feature.key]} feature={feature} />
        )}
    </PadBox>
}

function FeatureToggle({feature, defaultState=false}) {
    const features = useGlobalProperty('features');
    const enabled = features?.[feature.key] ?? defaultState;
    const datastore = useDatastore();

    if (feature.parentFeature && !features?.[feature.parentFeature]) return null;

    function onToggle() {
        const newFeatures = {
            ...features,
            [feature.key]: !enabled
        }
        callServerApiAsync({
            datastore, component: 'features', 
            funcname: 'setFeatures', 
            params: {features: newFeatures}
        });  
    }

    return <View style={{paddingVertical: 2, alignSelf: 'flex-end'}}><Toggle label={feature.name} value={enabled || false} 
        onChange={onToggle} /></View>
}

function UserInfo() {
    const s = UserInfoStyle;
    const fbUser = useFirebaseUser();
    const personaKey = usePersonaKey();
    const [hover, setHover] = useState(false);
    const [shown, setShown] = useState(false);
    const isAdmin = useIsAdmin();

    function popup() {
        return <View>
            <TextButton type='small' onPress={() => gotoInstance({structureKey:'profile', instanceKey: personaKey})} label='Profile' />
            <Pad />
            <TextButton type='small' onPress={firebaseSignOut} label='Log out' />
            {isAdmin && <Catcher><FeatureToggles /></Catcher>}
        </View>
    }

    if (fbUser) {
        return <Popup popupContent={popup} setHover={setHover} setShown={setShown} popupStyle={s.popup}>
            <PadBox vert={6} right={20}>
                <HorizBox center>
                    <Byline userId={personaKey} clickable={false} name={fbUser.displayName} underline={hover} />
                    <Pad size={8} />
                    {shown ? <IconChevronUpSmall/> : <IconChevronDownSmall />}
                </HorizBox>
            </PadBox>
        </Popup>
    } else {        
        return <PadBox horiz={20}><CTAButton type='secondary' onPress={() => pushSubscreen('login')} label='Log in' /></PadBox>
    }
}

const UserInfoStyle = StyleSheet.create({
    title: {
        fontSize: 18, fontWeight: 'bold',
    },
    right: {
        marginLeft: 12
    },
    popup: {
        marginRight: 20
    }
});


export function TopBarActionProvider({label, disabled, onPress}) {
    return <ObservableProvider observable={global_toolbarAction} value={{label, disabled, onPress}} />
}