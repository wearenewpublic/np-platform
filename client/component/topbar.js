import { StyleSheet, View } from "react-native";
import { closeSidebar, makeUrl } from "../util/navigate";
import { firebaseSignOut } from "../util/firebase";
import { useDatastore, useGlobalProperty, useInstanceKey, usePersonaKey, usePersonaObject, useSessionData, useSiloKey, useStableCallback, useStructureKey } from "../util/datastore";
import { useEffect, useState } from "react";
import { Byline } from "./people";
import { BreadCrumb, CTAButton, Popup, TextButton } from "./button";
import { HorizBox, Pad, PadBox, Separator } from "./basics";
import { getFeatureBlocks, useConfig, useEnabledFeatures } from "../util/features";
import { defaultFeatureConfig } from "../feature";
import { Catcher } from "../system/catcher";
import { getIsInSidebar, historyGetState } from "../platform-specific/url";
import { useIsAdmin } from "./admin";
import { CircleCount, UtilityText, WebLinkTextButton } from "./text";
import { AccordionField, RadioGroup, RadioOption, Toggle } from "./form";
import { colorGreyPopupBackground } from "./color";
import { ChevronDown, ChevronUp, Close, ArrowLeft } from '@carbon/icons-react';

export function TopBar() {
    const s = TopBarStyle;
    const instanceKey = useInstanceKey();
    const structureKey = useStructureKey();
    const toolbarAction = useSessionData('toolbarAction');
    const datastore = useDatastore();
    const isLogin = structureKey == 'login';
    const {topBarHelpBubbles} = useConfig();
    return <View style={s.outer}>
        <View style={s.topBox}>        
            <View style={s.leftRow}>    
                {historyGetState() ? 
                    <BreadCrumb icon={ArrowLeft} iconProps={{size:32}} onPress={() => datastore.goBack()} />
                : getIsInSidebar() ?
                    <BreadCrumb icon={Close} iconProps={{size:32}}  onPress={closeSidebar} />
                : null
                }
            </View>
            <Catcher>
                <HorizBox center>
                    {toolbarAction ? 
                        <PadBox right={12}><CTAButton size='compact' label={toolbarAction.label} disabled={toolbarAction.disabled} onPress={toolbarAction.onPress} /></PadBox>
                    : 
                        instanceKey && !isLogin && <UserInfo />
                    }
                </HorizBox>
            </Catcher>
        </View>
        <PadBox horiz={12}>
            {topBarHelpBubbles?.map((Bubble,i) => <Bubble key={i} />)}
        </PadBox>
    </View>
}

const TopBarStyle = StyleSheet.create({
    outer: {
        zIndex: 900
    },
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
    const structureKey = useStructureKey();
    const featureBlocks = getFeatureBlocks(structureKey);
    if (!featureBlocks) return null;
    return <View>
        <Pad />
        <Separator />
        <View style={{width: 300}} />
        <Pad size={20} />
        <UtilityText type='tiny' label='Features Enabled Here' caps />
        <Pad size={12} />
        {featureBlocks.map((featureBlock,i) => 
            <Catcher key={i}>
                <FeatureTreeNode featureBlock={featureBlock} />
            </Catcher>
        )}
    </View>
}

export function FeatureTreeNode({featureBlock}) {
    const s = FeatureTreeNodeStyle;
    const enabledFeatures = useEnabledFeatures();
    function isEnabled(fb) {
        return enabledFeatures?.[fb.key] || enabledFeatures?.[fb.parent?.key]
    }
    if (featureBlock.section) {
        const enabledCount = featureBlock.features.filter(isEnabled).length;
        const titleContent = <HorizBox center spread>
            {featureBlock.level == 2 ? 
                <UtilityText type='tiny' caps strong label={featureBlock.label} />
            :
                <UtilityText strong label={featureBlock.label} />
            }
            <Pad size={8} />
            {enabledCount ? <CircleCount count={enabledCount} /> : null}
        </HorizBox>
        return <AccordionField testID={featureBlock.label} titleContent={titleContent}>
            {featureBlock.features.map((fb,i) => 
                <Catcher key={i}>
                    <FeatureTreeNode featureBlock={fb} />
                </Catcher>
            )}
        </AccordionField>
    } else if (featureBlock.composite) {
        const enabled = enabledFeatures?.[featureBlock.parent.key] ?? false;
        if (!enabled) {
            return <FeatureToggle feature={featureBlock.parent} />
        } else {
            return <View>
                <FeatureToggle feature={featureBlock.parent} />
                <View style={s.subFeatures} >
                    {featureBlock.features.map((fb,i) => 
                        <Catcher key={i}>
                            <FeatureTreeNode featureBlock={fb} />
                        </Catcher>
                    )}
                </View>
            </View>
        }
    } else if (featureBlock.chooseOne) {
        return <ChooseOneFeature label={featureBlock.label} featureList={featureBlock.features} />
    } else if (featureBlock.name) {
        return <FeatureToggle feature={featureBlock} />
    } else {
        console.error('Unknown feature node', featureBlock);
        return null;
    }
}
const FeatureTreeNodeStyle = StyleSheet.create({
    subFeatures: {
        backgroundColor: colorGreyPopupBackground,
        paddingHorizontal: 12,
        borderRadius: 8
    }
})

function ChooseOneFeature({label, featureList}) {
    const enabledFeatures = useEnabledFeatures();
    const firstEnabled = featureList.find(f => enabledFeatures?.[f.key])?.key;
    const [chosenFeature, setChosenFeature] = useState(firstEnabled);
    const datastore = useDatastore();
    function onChange(value) {
        const newFeatures = {
            ...enabledFeatures,
            [chosenFeature]: false,
            [value]: true
        }
        datastore.setGlobalProperty('features', newFeatures);
        setChosenFeature(value);
    }
    return <View>
        {label && <PadBox vert={12}><UtilityText strong caps type='tiny' label={label} /></PadBox>}
        <RadioGroup value={chosenFeature} onChange={onChange}>
            {featureList.map(f =>
                <RadioOption key={f.key} radioKey={f.key} label={f.name} />
        )}
        </RadioGroup>
    </View>
}

function FeatureToggle({feature}) {
    const structureKey = useStructureKey();
    const defaultFeatures = defaultFeatureConfig[structureKey] ?? {};
    const defaultState = defaultFeatures[feature.key] ?? false;
    
    const features = useGlobalProperty('features');
    const enabled = features?.[feature.key] ?? defaultState;
    const datastore = useDatastore();

    if (feature.parentFeature && !features?.[feature.parentFeature]) return null;

    function onToggle() {
        const newFeatures = {
            ...features,
            [feature.key]: !enabled
        }
        datastore.setGlobalProperty('features', newFeatures);
    }

    return <Toggle label={feature.name} spread value={enabled || false} onChange={onToggle} />
}

function UserInfo() {
    const s = UserInfoStyle;
    const personaKey = usePersonaKey();
    const persona = usePersonaObject(personaKey);
    const [hover, setHover] = useState(false);
    const [shown, setShown] = useState(false);
    const isAdmin = useIsAdmin();
    const datastore = useDatastore();
    const siloKey = useSiloKey();

    function popup() {
        return <View>
            <TextButton type='small' onPress={() => datastore.gotoInstance({structureKey:'profile', instanceKey: personaKey})} label='Profile' />
            {isAdmin && <PadBox top={20}>
                <WebLinkTextButton url={makeUrl(['admin','one'])} label='Admin' />
            </PadBox>}  
            <Pad />
            <TextButton type='small' onPress={firebaseSignOut} label='Log out' />
            {isAdmin && <Catcher><FeatureToggles /></Catcher>}
        </View>
    }

    function onLogin() {
        datastore.gotoInstance({structureKey: 'login', instanceKey: 'one'});
    }

    if (personaKey) {
        return <Popup testID='account-menu' popupContent={popup} setHover={setHover} setShown={setShown} popupStyle={s.popup}>
            <PadBox vert={6} right={20}>
                <HorizBox center>
                    <Byline userId={personaKey} clickable={false} name={persona.name} underline={hover} />
                    <Pad size={8} />
                    {shown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </HorizBox>
            </PadBox>
        </Popup>
    } else {        
        return <PadBox horiz={20}>
            <CTAButton type='secondary' onPress={onLogin} size='compact' label='Log in' />
        </PadBox>
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
        marginRight: 20,
    }
});


// We need to use useStableCallback because otherwise
// we either update setSessionData every time the callback changes, which 
// risks creating dependency loops, or we don't update the button when
// the callback changes, and the button doesn't work.
export function TopBarActionProvider({label, disabled, onPress}) {
    const datastore = useDatastore();
    const stableOnPress = useStableCallback(onPress);
    useEffect(() => {
        datastore.setSessionData('toolbarAction', {label, disabled, onPress: stableOnPress});
        return () => {
            datastore.setSessionData('toolbarAction', null);
        }
    }, [label, disabled, stableOnPress]);
    return null;
}
