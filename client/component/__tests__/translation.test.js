import { languageFrench, languageGerman, translateLabel } from "../translation";

jest.mock('../../util/firebase');

test('translateLabel', () => {
    expect(translateLabel({label: 'Member', language: languageFrench})).toBe('Membre');
    expect(translateLabel({label: 'Guest', language: languageGerman})).toBe('Gast');
});

test('translateLabel with plurals', () => {
    expect(translateLabel({label: '{count} {noun} {isAre} here', language: languageFrench, 
        formatParams: {singular: 'person', plural: 'people', count: 1}}))
        .toBe('1 personne est ici');
});

test('translateLabel with params', () => {
    expect(translateLabel({label: 'Hello {name}', language: languageFrench, 
        formatParams: {name: 'Alice'}}))
        .toBe('Bonjour Alice');
})

