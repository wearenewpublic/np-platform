import { screen, render } from "@testing-library/react";
import { WithEnv, WithFeatures, setModulePublicData } from "../../util/testutil";
import { TranslatableText, languageEnglish, languageFrench, languageGerman, translateLabel } from "../translation";
import { addTranslations } from "../../translations";

jest.mock('../../util/firebase');

test('translateLabel', () => {
    expect(translateLabel({label: 'Member', language: languageFrench})).toBe('Membre');
    expect(translateLabel({label: 'Guest', language: languageGerman})).toBe('Gast');
    expect(translateLabel({label: 'Guest', language: languageEnglish})).toBe('Guest');
});

test('translateLabel with plurals', () => {
    expect(translateLabel({label: '{count} {noun} {isAre} here', language: languageFrench, 
        formatParams: {singular: 'person', plural: 'people', count: 1}}))
        .toBe('1 personne est ici');
    expect(translateLabel({label: '{count} {noun} {isAre} here', language: languageFrench, 
        formatParams: {singular: 'person', plural: 'people', count: 2}}))
        .toBe('2 personnes sont ici');
});

test('translateLabel with params', () => {
    expect(translateLabel({label: 'Hello {name}', language: languageFrench, 
        formatParams: {name: 'Alice'}}))
        .toBe('Bonjour Alice');
})

test('translation based on silo language', () => {
    setModulePublicData({siloKey: 'silo-fr', moduleKey: 'language', data: languageFrench});
    render(<WithEnv siloKey='silo-fr'><TranslatableText label='Member'/></WithEnv>);
    screen.getByText('Membre');
})

test('Add Translations', () => {
    addTranslations({french: {Awesome: 'Génial', Horrible: 'Terrible'}});
    expect(translateLabel({label: 'Awesome', language: languageFrench})).toBe('Génial');
    expect(translateLabel({label: 'Horrible', language: languageFrench})).toBe('Terrible');

});

