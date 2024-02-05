import { useContext } from "react";
import { translations } from "../translations";
import { InstanceContext } from "../organizer/InstanceContext";
import { Text } from "react-native";
import { formatString } from "../util/util";
import { useFirebaseData } from "../util/firebase";

export const languageEnglish = 'English';
export const languageGerman = 'German';
export const languageFrench = 'French';

const ui_translations_for_language = {
    German: translations.german,
    French: translations.french
}

export function translateLabel({label, language, formatParams={}}) {
    var extra = {};
    if (formatParams?.singular && formatParams?.plural) {
        if (formatParams.count == 1) {
            extra = {
                noun: translateLabel({label: formatParams.singular, language}), 
                isAre: translateLabel({label: 'is', language})
            }
        } else {
            extra = {
                noun: translateLabel({label: formatParams.plural, language}), 
                isAre: translateLabel({label: 'are', language})
            }
        }
    }
    const translations = ui_translations_for_language[language];
    var translatedText = translations ? translations[label] : label;

    if (!translatedText && language != languageEnglish && language) {
        console.log('No translation for ' + label + ' in ' + language);
    }
    if (formatParams) {
        translatedText = formatString(translatedText || label, {...formatParams, ...extra});
    }
    return translatedText || label;
}

export function useLanguage() {
    const {structureKey, instanceKey, instance} = useContext(InstanceContext);    
    const globalLanguage = useFirebaseData(['structure', structureKey, 'instance', instanceKey, 'global', 'language']);

    if (!instance) {
        return null;
    } else if (!instance?.isLive || instance?.language) {
        return instance.language;
    } else {
        return globalLanguage;
    }
}

export function useTranslation(label, formatParams) {
    const language = useLanguage();
    if (label == null) return null;
    return translateLabel({label, language, formatParams});
}

export function TranslatableText({text, label, formatParams, style, ...props}) {
    try {
        const translatedLabel = useTranslation(label, formatParams);
        return <Text style={style} {...props}>{translatedLabel || label || text}</Text>
    } catch (e) {
        console.log('Error translating ' + label, e);
        throw Error('Error translating ' + label + ': ' + e);
        // return <Text style={style} {...props}>{label}</Text>
    }
}

