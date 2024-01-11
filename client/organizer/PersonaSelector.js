import { StyleSheet, Text, View } from "react-native";
import { PopupSelector } from "../platform-specific/popup";
import { useDatastore, useGlobalProperty, usePersonaKey } from "../util/datastore";
import { translateLabel, useLanguage } from "../component/translation";
import { useContext } from "react";
import { InstanceContext } from "./InstanceContext";
import { ProfilePhoto } from "../component/people";

export function PersonaSelector() {
    const s = PersonaSelectorStyle;
    const selectedPersona = usePersonaKey();
    const allPersonas = useGlobalProperty('persona');
    const language = useLanguage();
    const datastore = useDatastore();
    const {instance} = useContext(InstanceContext);
    const itemKeys = Object.keys(allPersonas || {});    
    const items = itemKeys.map(key => ({key, label: getPersonaName({language, instance, personas: allPersonas, personaKey: key})}));
    return <View style={s.row}>
        <View style={{marginHorizontal: 4, marginVertical: 2}}>
            <PopupSelector value={selectedPersona} items={items} 
                onSelect={personalKey => datastore.setSessionData('personaKey', personalKey)} 
            />
        </View>
        <ProfilePhoto userId={selectedPersona} type='small' />
    </View>
}

const PersonaSelectorStyle = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8
    }
})

function getPersonaName({language, personas, instance, personaKey}) {
    const persona = personas[personaKey];
    if (instance?.personaTitle?.[personaKey]) {
        return persona.name + ' (' + instance?.personaTitle?.[personaKey] + ')';
    } else if (persona.label) {
        const tLabel = translateLabel({label: persona.label, language});
        return persona.name + ' (' + tLabel + ')';
    } else {
        return persona.name;
    }
}
