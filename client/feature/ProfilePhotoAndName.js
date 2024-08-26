import { HorizBox, Pad } from "../component/basics";
import { Heading, Paragraph, TextField, UtilityText } from "../component/text";
import { StyleSheet, View } from "react-native";
import { useDatastore, useInstanceKey, usePersonaKey, usePersonaObject } from "../util/datastore";
import { FaceImage, FaceSelect, LetterFace, ProfilePhoto } from "../component/people";
import { useEditableField, useEditErrors, WithEditableFields } from "../structure/profile";
import { RadioGroup, RadioOption } from "../component/form";
import { colorPinkBackground, colorRedBackground, colorTextGrey } from "../component/color";
import { Banner } from "../component/banner";
import { Catcher } from "../component/catcher";
import React, { useState } from "react";
import { CTAButton } from "../component/button";

export const ProfilePhotoAndNameFeature = {
    key: 'profileeditname',
    name: 'Photo and Name',
    config: {
        profileModules: [{
            label: 'photo and name', key: 'photoandname', 
            view: ViewPhotoAndName,
            edit: EditPhotoAndName,
            checkForErrors: checkPhotoAndNameAsync,
            makePreview: previewPhotoAndName,
        }]
    }
}

export const ProfileOldStuff = {
    key: 'profile_old',
    name: 'Old Profile Stuff',
    config: {
        profileModules: [{
            label: 'photo and name', key: 'old', 
            view: ViewPhotoAndName
        }]
    }
}

function ViewPhotoAndName() {
    const personaKey = useInstanceKey();
    const persona = usePersonaObject(personaKey);

    return <View>    
        <HorizBox center>
            <ProfilePhoto userId={personaKey} type='huge' />
            <Pad />      
            <Heading level={1} text={persona.name} />            
        </HorizBox>
    </View>
}

function EditPhotoAndName() {
    const [nameMode, setNameMode] = useEditableField('nameMode', 'full');
    const datastore = useDatastore();
    const fbUser = datastore.getFirebaseUser();
    const [name, setName] = useEditableField('name', fbUser.displayName);

    function onChangeNameMode(nameMode) {
        setNameMode(nameMode);
        if (nameMode == 'full') {
            setName(fbUser.displayName);
        } else {
            setName('');
        }
    }

    return <View>
        <Heading label='Profile name'/>
        <Pad size={12} />
        <RadioGroup value={nameMode} onChange={onChangeNameMode}>
            <RadioOption radioKey='full' text={fbUser.displayName} />
            <RadioOption radioKey='custom' text='A pseudonym' />
        </RadioGroup>
        {nameMode == 'custom' && <Catcher><PseudonymEditor /></Catcher>}
        <Pad size={24}/>
        <Heading label='Your profile photo'/>
        <Pad size={20} />
        <Catcher><ProfilePhotoEditor /></Catcher>
    </View>
}

function makeHueForString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to a 32bit integer
    }
    return Math.abs(hash) % 360;
}

function ProfilePhotoEditor() {
    const datastore = useDatastore();
    const personaKey = usePersonaKey();
    const fbUser = datastore.getFirebaseUser();
    const [photoUrl, setPhotoUrl] = useEditableField('photoUrl', fbUser.photoURL);
    const defaultHue = makeHueForString(personaKey);
    const [hue, setHue] = useEditableField('hue', defaultHue);
    const [name, setName] = useEditableField('name', fbUser.displayName);
    const [photoMode, setPhotoMode] = useEditableField('photoMode', 'photo');

    function onSelectLetter() {
        setPhotoUrl(null); setHue(defaultHue); setPhotoMode('letter');
    }
    function onSelectPhoto() {
        setPhotoUrl(fbUser.photoURL); setHue(null); setPhotoMode('photo');
    }
    const isPhoto = photoMode == 'photo';

    return <HorizBox>
        <FaceSelect testID='photo' selected={isPhoto} onSelect={onSelectPhoto}>
            <FaceImage type='huge' photoUrl={photoUrl ?? fbUser.photoURL} />
        </FaceSelect>
        <Pad size={24} />
        <FaceSelect testID='letter' selected={!isPhoto} onSelect={onSelectLetter}>
            <LetterFace type='huge' hue={defaultHue} name={name} />
        </FaceSelect>
    </HorizBox>
}

function PseudonymEditor() {
    const [name, setName] = useEditableField('name', '');
    const errors = useEditErrors();

    return <View>
        <TextField value={name} error={errors.hasError}
            onChange={setName} testID='pseudonym'
            placeholder='Enter a pseudonym'/>
        <Pad size={12} />
        {errors.nameTaken ?
            <Banner color={colorRedBackground}>
                <UtilityText label='This pseudonym is already in use. Please choose a different one.' />
            </Banner>
        : errors.nameInvalid ?
            <Banner color={colorRedBackground}>
                <UtilityText label='Pseudonyms can contain only lower case letters and numbers.' />
            </Banner>
        :
            <UtilityText type='small' color={colorTextGrey} 
                label='You can change your pseudonym at most once a week'
            />
        }
    </View>
}



async function checkPhotoAndNameAsync({datastore, updates}) {
    if (updates.nameMode == 'full') {
        return null;
    }
    const {name, nameMode} = updates;
    if (nameMode == 'custom') {
        if (!name || !name.match(/^[a-z0-9]+$/)) {
            return {nameInvalid: true};
        }
        const existingNameOwner = await datastore.getModulePublicAsync('profile', ['pseudonym', name]);
        if (existingNameOwner && existingNameOwner != datastore.getPersonaKey()) {
            return {nameTaken: true};
        }
    }
    return null;
}

function previewPhotoAndName({updates}) {
    return {name: updates.name, photoUrl: updates.photoUrl, hue: updates.hue};
}

export function FirstLoginSetup({onFieldsChosen}) {
    const s = FirstLoginSetupStyle;
    const datastore = useDatastore();
    const fbUser = datastore.getFirebaseUser();

    const defaultState = {name: fbUser.displayName, photoUrl: fbUser.photoURL, hue: makeHueForString(fbUser.uid)};
    const [updates, setUpdates] = useState(defaultState);
    const [errors, setErrors] = useState({});
    const [inProgress, setInProgress] = useState(false);
 
    async function onContinue() {
        setInProgress(true);
        const errors = await checkPhotoAndNameAsync({datastore, updates});
        if (errors) {
            setErrors(errors);
            setInProgress(false);
            return;
        } else {
            setErrors({});
        }

        const preview = previewPhotoAndName({updates});

        onFieldsChosen({updates, preview});
    }

    return <View style={s.outer}>
        <Heading level={1} label="Let's get your profile set up" />
        <Pad size={8} />
        <Paragraph label='How do you want to appear to others?' />
        <Pad size={40} />
        <WithEditableFields updates={updates} setUpdates={setUpdates} errors={errors}>
            <EditPhotoAndName />
        </WithEditableFields>
        <Pad size={32} />
        <CTAButton wide disabled={inProgress} label={inProgress ? 'Please Wait...' : 'Continue'} onPress={onContinue} />
    </View>
}
const FirstLoginSetupStyle = StyleSheet.create({
    outer: {
        backgroundColor: colorPinkBackground,
        padding: 20,
        borderRadius: 12
    }
});

export function FirstLoginSetupTester() {
    const [updates, setUpdates] = useState(null);
    const [preview, setPreview] = useState(null);

    function onFieldsChosen({updates, preview}) {
        setUpdates(updates);
        setPreview(preview);
    }

    if (updates) {
        return <View>
            <Heading label='Fields chosen' />
            <Pad size={10} />
            <UtilityText text={JSON.stringify(updates)} />
            <Pad size={10} />
            <UtilityText label={JSON.stringify(preview)} />
        </View>
    } else {
        return <FirstLoginSetup onFieldsChosen={onFieldsChosen} />
    }
}
