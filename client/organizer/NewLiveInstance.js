import { StyleSheet, TextInput } from "react-native";
// import { AutoSizeTextInput, Card, FormField, HorizBox, MultiLineTextInput, Narrow, OneLineTextInput, Pad, PadBox, PrimaryButton, SecondaryButton, SectionTitleLabel } from "../component/basics";
import { firebaseNewKey, firebaseWriteAsync, getFirebaseUser, useFirebaseUser } from "../util/firebase";
import { useState } from "react";
import { languageEnglish, languageFrench, languageGerman, useTranslation } from "../component/translation";
import { PopupSelector } from "../platform-specific/popup";
import { goBack, gotoLogin, replaceInstance } from "../util/navigate";
import { boolToString, generateRandomKey, getPath, setPath, stringToBool } from "../util/util";
import { replaceUrl } from "./url";
import { Heading, TextField, UtilityText } from "../component/text";
import { Card, HorizBox, Narrow, Pad, PadBox } from "../component/basics";
import { CTAButton } from "../component/button";
import { FormField } from "../component/form";

const nameParam = {key: 'name', name: 'Name', type: 'shorttext', placeholder: 'What is this instance called?'};
const languageParam = {key: 'language', name: 'Language', type: 'select', options: [
    {key: languageEnglish, label: 'English'},
    {key: languageFrench, label: 'French'},
    {key: languageGerman, label: 'German'}
]}


export function NewLiveInstanceScreen({prototype}) {
    const s = NewLiveInstanceScreenStyle;
    const newInstanceParams = prototype.newInstanceParams || [];
    const firebaseUser = useFirebaseUser();
    const [instanceGlobals, setInstanceGlobals] = useState({});

    function onCancel() {
        goBack();
    }

    async function onCreate() {
        console.log('Creating instance', instanceGlobals);
        const key = generateRandomKey(20);
        const createTime = Date.now();
        const expandedGlobals = {
            ...instanceGlobals, admin: firebaseUser.uid, createTime
        }
        const userData = {
            name: expandedGlobals.name, createTime, language: expandedGlobals.language ?? languageEnglish
        }
        firebaseWriteAsync(['prototype', prototype.key, 'instance', key, 'global'], expandedGlobals);
        firebaseWriteAsync(['prototype', prototype.key, 'userInstance', firebaseUser.uid, key], userData);
        firebaseWriteAsync(['userInstance', firebaseUser.uid, prototype.key, key], userData);
        const fbUser = getFirebaseUser();
        firebaseWriteAsync(['prototype', prototype.key, 'instance', key, 'collection', 'persona', fbUser.uid], {
            photoUrl: fbUser.photoURL, 
            name: fbUser.displayName, 
            key: fbUser.uid,
            member: true
        });
    
        if (prototype.newInstanceRoboPersonas) {
            firebaseWriteAsync(['prototype', prototype.key, 'instance', key, 'collection', 'persona'], prototype.newInstanceRoboPersonas);            
        }
        replaceInstance({prototypeKey: prototype.key, instanceKey: key});
    }

    if (!firebaseUser) {
        return <PadBox><CTAButton label='Log in to create a live instance' onPress={gotoLogin} /></PadBox>
    } 

    return <Narrow>
        <Card>
            <Heading label='New Instance of {prototypeName}' formatParams={{prototypeName: prototype.name}}/>
            <Pad size={16} />
            <InstanceParamSetter param={nameParam} instanceGlobals={instanceGlobals} setInstanceGlobals={setInstanceGlobals} />
            <Pad/>
            <InstanceParamSetter param={languageParam} instanceGlobals={instanceGlobals} setInstanceGlobals={setInstanceGlobals} />
            <Pad />

            {newInstanceParams.map(param =>
                <PadBox bottom={20} key={param.key}>
                    <InstanceParamSetter param={param} instanceGlobals={instanceGlobals} setInstanceGlobals={setInstanceGlobals} />
                </PadBox>
            )}
            <Pad size={16} />
            <HorizBox spread>
                <CTAButton label='Create Live Instance' onPress={onCreate} />
                <CTAButton type='secondary' label='Cancel' onPress={onCancel} />
            </HorizBox>
        </Card>
    </Narrow>
}

const NewLiveInstanceScreenStyle = StyleSheet.create({
})


function InstanceParamSetter({param, instanceGlobals, setInstanceGlobals}) {
    const tEnter = useTranslation('Enter');
    const tPlaceholder = useTranslation(param.placeholder || null);
    const value = getPath(instanceGlobals, param.key) || '';
    function setValue(value) {
        const newGlobals = setPath(instanceGlobals, param.key, value);
        setInstanceGlobals(newGlobals);
    }
    if (param.type == 'shorttext' || param.type == 'text' || param.type == 'url') {
        return <FormField label={param.name}>
            <TextField  
                placeholder={tPlaceholder ?? (tEnter + ' ' + param.name)}
                value={value} 
                onChange={setValue} />
        </FormField>
    } else if (param.type == 'longtext') {
        return <FormField label={param.name}>
            <TextField  
                placeholder={tPlaceholder ?? (tEnter + ' ' + param.name)}
                value={value} 
                onChange={setValue} />
        </FormField>
    } else if (param.type == 'select') {
        return <FormField label={param.name}>
            <PopupSelector items={param.options} value={value} 
                onSelect={setValue}/>
        </FormField>
    } else if (param.type == 'boolean') {
        return <FormField label={param.name}>
            <PopupSelector items={[
                {key: 'true', label: 'Yes'},
                {key: 'false', label: 'No'}
            ]} value={boolToString(value)} 
                onSelect={value => setValue(stringToBool(value))} />
        </FormField>
    } else {
        return <UtilityText label='Not yet'/>
    }
}

