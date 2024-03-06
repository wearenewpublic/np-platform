import { useContext } from "react";
import { allTranslations } from "../translations";
import { InstanceContext } from "../organizer/InstanceContext";
import { Text } from "react-native";
import { formatString } from "../util/util";
import { useFirebaseData } from "../util/firebase";

export const languageEnglish = 'english';
export const languageGerman = 'german';
export const languageFrench = 'french';


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
    
    const translations = allTranslations[language];
    if (language && language != languageEnglish && !translations) {
        console.error('No translations for ' + language);
    }

    var translatedText = translations ? translations[label] : label;

    if (!translatedText && language != languageEnglish && language) {
        console.error('No translation for ' + label + ' in ' + language);
    }
    if (formatParams) {
        translatedText = formatString(translatedText || label, {...formatParams, ...extra});
    }

    return translatedText || label;
}

export function useLanguage() {
    const {siloKey} = useContext(InstanceContext);    
    const globalLanguage = useFirebaseData(['silo', siloKey, 'module-public', 'language']);

    if (!siloKey) {
        return null;
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
        console.error('Error translating ' + label, e);
        return <Text style={style} {...props}>{label || text}</Text>
    }
}

