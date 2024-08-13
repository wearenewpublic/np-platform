import { deepClone } from "../util/util";

function faceUrl(face) {
    return 'https://psi.newpublic.org/faces/' + face;
}

export const personaA = {
    key: 'a',
    name: 'Alice Adams',
    photoUrl: faceUrl('face9.jpeg')
};

export const personaB = {
    key: 'b',
    name: 'Bob Bauer',
    photoUrl: faceUrl('face10.jpeg')
};

export const personaC = {
    key: 'c',
    name: 'Camila Costa',
    photoUrl: faceUrl('face7.jpeg')
};

export const personaD = {
    key: 'd',
    name: 'Daniel Dubois',
    photoUrl: faceUrl('face2.jpeg')
};

export const personaE = {
    key: 'e',
    name: 'Emeka Eze',
    photoUrl: faceUrl('face4.jpeg')
};

export const personaF = {
    key: 'f',
    name: 'Finn Fischer',
    photoUrl: faceUrl('face3.jpeg')
};

export const personaG = {
    key: 'g',
    name: 'Grace Gomes',
    photoUrl: faceUrl('face8.jpeg')
};

export const personaH = {
    key: 'h',
    name: 'Hiroshi Hasegawa',
    photoUrl: faceUrl('face6.jpeg')
};

export const personaI = {
    key: 'i',
    name: 'Ingrid Ishida',
    photoUrl: faceUrl('face5.jpeg')
};

export const personaJ = {
    key: 'j',
    name: 'Jamal Joubert',
    photoUrl: faceUrl('face1.jpeg'),
};

export const personaK = {
    key: 'k',
    name: 'Keita Khan',
    photoUrl: faceUrl('face3.jpeg'),
};

export const personaL = {
    key: 'l',
    name: 'Larry Leclerc',
    photoUrl: faceUrl('face4.jpeg'),
}

export const defaultPersona = 'a';

export const defaultPersonaList = [personaA, personaB, personaC, personaD, personaE, personaF,
    personaG, personaH, personaI, personaJ, personaK, personaL]


export function personaListToMap(personas) {
    const result = {};
    personas.forEach(persona => result[persona.key] = deepClone(persona));
    return result;
}

