import { HorizBox, Pad } from "../component/basics";
import { Heading, TextField, UtilityText } from "../component/text";
import { View } from "react-native";
import { useDatastore, useInstanceKey, usePersonaObject } from "../util/datastore";
import { FaceImage } from "../component/people";
import { useEditableField, useEditErrors, useProfileField, FieldEditContext } from "../structure/profile";
import { RadioGroup, RadioOption } from "../component/form";
import { colorPinkBackground, colorTextGrey } from "../component/color";
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
    const {updates} = React.useContext(FieldEditContext);
    const userId = useInstanceKey();
    const userObject = usePersonaObject(userId);
    const name = useProfileField('name', userObject?.name);
    const photoUrl = useProfileField('photoUrl', userObject?.photoUrl);

    return <View>    
        <HorizBox center>
            <FaceImage type='huge' photoUrl={photoUrl} />  
            <Pad />      
            <Heading level={1} label={name} />            
        </HorizBox>
    </View>
}

function EditPhotoAndName() {
    const [nameMode, setNameMode] = useEditableField('nameMode', 'full');
    const [name, setName] = useEditableField('name', '');
    const datastore = useDatastore();
    const fbUser = datastore.getFirebaseUser();

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
    </View>
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
            <Banner color={colorPinkBackground}>
                <UtilityText label='This pseudonym is already in use. Please choose a different one.' />
            </Banner>
        : errors.nameInvalid ?
            <Banner color={colorPinkBackground}>
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
    const name = updates.name;
    if (!name || !name.match(/^[a-z0-9]+$/)) {
        return {nameInvalid: true};
    }
    const existingNameOwner = await datastore.getModulePublicAsync('profile', ['pseudonym', name]);
    if (existingNameOwner && existingNameOwner != datastore.getPersonaKey()) {
        return {nameTaken: true};
    }
    return null;
}

function previewPhotoAndName({updates}) {
    return {name: updates.name}
}


