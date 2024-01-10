import { ui_translations_french } from "./ui_french";
import { ui_translations_german } from "./ui_german";

export var translations = {
    french: ui_translations_french,
    german: ui_translations_german
}

export function addTranslations(newTranslations) {
    Object.keys(newTranslations).forEach(language => {
        translations[language] = {...translations[language], ...newTranslations[language]};
    })
}

