import React, { useState } from "react";
import { Container, ConversationScreen, HorizBox, LoadingScreen, Pad, PadBox } from "../component/basics";
import { Catcher } from "../component/catcher";
import { useServersideConstructor } from "../component/constructor";
import { FaceImage } from "../component/people";
import { Heading, UtilityText } from "../component/text";
import { useDatastore, useGlobalProperty, useInstanceKey, usePersonaKey, usePersonaObject } from "../util/datastore";
import { useConfig } from "../util/features";
import { View } from "react-native";
import { CTAButton, TextButton } from "../component/button";
import { useTranslation } from "../component/translation";
import { callServerApiAsync } from "../util/servercall";
import { removeUndefinedFields } from "../util/util";

export const ProfileStructure = {
    key: 'profile',
    name: 'User Profile',
    screen: ProfileScreen,
    defaultConfig: {
        profileWidgets: [],
        profileModules: [],
    }
}

function ProfileScreen() {    
    const userId = useInstanceKey();
    const initialized = useServersideConstructor();
    const userObject = usePersonaObject(userId);
    const userName = userObject?.name;
    const photoUrl = userObject?.photoUrl;
    const {profileWidgets, profileModules} = useConfig();

    if (!initialized) return <LoadingScreen label='Loading profile...'/>
    if (!userName) return <LoadingScreen label='No such user'/>

    return <ConversationScreen>
        <Pad/>
        <PadBox horiz={20}>
            {profileModules.map((module, i) => 
                <Catcher key={i}>
                    <ProfileModuleHolder module={module} />
                </Catcher>
            )}
            {profileWidgets.map((Widget, i) => <Catcher key={i}><Widget /></Catcher>)}
        </PadBox>
    </ConversationScreen>
}

export const FieldEditContext = React.createContext({});

export function ProfileModuleHolder({module}) {
    const [editing, setEditing] = useState(false);
    const personaKey = usePersonaKey();
    const instanceKey = useInstanceKey(); 
    const isMyProfile = personaKey === instanceKey;
    const tLabel  = useTranslation(module.label);
    const oldState = useGlobalProperty('fields') ?? {};
    const [updates, setUpdates] = useState(oldState);
    const [errors, setErrors] = useState({});
    const [inProgress, setInProgress] = useState(false);
    const moduleData = useGlobalProperty(module.key);
    const datastore = useDatastore({moduleData});

    async function onSave() {
        setInProgress(true);
        const {checkForErrors, makePreview} = module;
        if (checkForErrors) {
            const newErrors = await checkForErrors({datastore, updates});
            if (newErrors && Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setInProgress(false);
                return;
            }
        }
        var preview = null;
        if (makePreview) {
            preview = removeUndefinedFields(makePreview({updates}));
        }
        await callServerApiAsync({datastore, component: 'profile', funcname: 'update', 
            params: {moduleKey: module.key, updates, preview}});
        setInProgress(false);
        setEditing(false);
        setErrors({});
    }

    function onCancel() {
        setEditing(false);
        setErrors({});
        setUpdates(oldState ?? {});
    }

    // HACK
    var pendingUpdates = {};
    function updateField(key, value) {
        pendingUpdates = {...pendingUpdates, [key]: value} 
        setUpdates({...updates, ...pendingUpdates});
    }

    if (editing) {
        return <Container>
            <FieldEditContext.Provider value={{updates, updateField, errors}}>
                <PadBox horiz={20} vert={20}>
                    {React.createElement(module.edit, {updates, setUpdates, errors})}
                    <Pad size={24} />
                    <HorizBox center>
                        {inProgress ? 
                            <CTAButton label='Saving...' disabled />
                        :
                            <CTAButton label='Save' onPress={onSave} />
                        }
                        <Pad />
                        <TextButton label='Cancel' onPress={onCancel} />
                    </HorizBox>
                </PadBox>
            </FieldEditContext.Provider>
        </Container>
    } else {
        return <View>
            <FieldEditContext.Provider value={{updates, updateField, errors}}>            
                {React.createElement(module.view)}
                <Pad size={24} />
                {isMyProfile && module.edit && <CTAButton
                    type='secondary' compact 
                    label='Edit {tLabel}' formatParams={{tLabel}} 
                    onPress={() => setEditing(true)} />
                }
            </FieldEditContext.Provider>
        </View>
    }
}

export function useProfileFields() {
    const {updates} = React.useContext(FieldEditContext);
    return updates;
}

export function useEditableField(key, defaultValue) {
    const {updates, updateField} = React.useContext(FieldEditContext);
    const value = updates[key];
    return [updates[key] === undefined ? defaultValue : value, value => updateField(key, value)];
}

export function useProfileField(key, defaultValue=null) {
    const {updates} = React.useContext(FieldEditContext);
    const value = updates[key];
    return value === undefined ? defaultValue : value;
}

export function useProfileFieldsSetter() {

}


export function useEditErrors() {
    const {errors} = React.useContext(FieldEditContext);
    return errors;
}
