import { ui_translations_french } from "./ui_french";
import { ui_translations_german } from "./ui_german";

export var allTranslations = {
    french: ui_translations_french,
    german: ui_translations_german
}

export function addTranslations(newTranslations) {
    Object.keys(newTranslations).forEach(language => {
        allTranslations[language] = {...allTranslations[language], ...newTranslations[language]};
    })
}

