import { HorizBox, Pad } from "../component/basics";
import { Heading, TextField, UtilityText } from "../component/text";
import { View } from "react-native";
import { useDatastore, useGlobalProperty, useInstanceKey, usePersonaKey, usePersonaObject, usePersonaPreview } from "../util/datastore";
import { FaceButton, FaceImage, FaceSelect, LetterFace, ProfilePhoto } from "../component/people";
import { useEditableField, useEditErrors, useProfileField, FieldEditContext } from "../structure/profile";
import { RadioGroup, RadioOption } from "../component/form";
import { colorPinkBackground, colorRedBackground, colorTextGrey } from "../component/color";
import { Banner } from "../component/banner";
import { Catcher } from "../component/catcher";
import React from "react";

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
        <Pad size={12} />
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


