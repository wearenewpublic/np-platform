import { deepClone } from "../util/util";



  export const personaA = {
    key: 'a',
    name: 'Alice Adams',
    face: 'face9.jpeg'
  };

  export const personaB = {
    key: 'b',
    name: 'Bob Bauer',
    face: 'face10.jpeg'
  };

  export const personaC = {
    key: 'c',
    name: 'Camila Costa',
    face: 'face7.jpeg',
  };

  export const adminA = {
    key: 'a',
    name: 'Alice Adams',
    face: 'face9.jpeg',
    member: true,
    admin: true,
    label: 'Admin'
  };

  export const memberB = {
    key: 'b',
    name: 'Bob Bauer',
    face: 'face10.jpeg',
    member: true,
    label: 'Member'
  };

  export const memberC = {
    key: 'c',
    name: 'Camila Costa',
    face: 'face7.jpeg',
    member: true,
    label: 'Member'
  };

  export const personaD = {
    key: 'd',
    name: 'Daniel Dubois',
    face: 'face2.jpeg'
  };

  export const personaE = {
    key: 'e',
    name: 'Emeka Eze',
    face: 'face4.jpeg'
  };

  export const personaF = {
    key: 'f',
    name: 'Finn Fischer',
    face: 'face3.jpeg'
  };

  export const personaG = {
    key: 'g',
    name: 'Grace Gomes',
    face: 'face8.jpeg'
  };

  export const personaH = {
    key: 'h',
    name: 'Hiroshi Hasegawa',
    face: 'face6.jpeg',
  };

  export const personaI = {
    key: 'i',
    name: 'Ingrid Ishida',
    face: 'face5.jpeg',
  };

  export const personaJ = {
    key: 'j',
    name: 'Jamal Joubert',
    face: 'face6.jpeg'
  };

  export const personaK = {
    key: 'k',
    name: 'Keita Khan',
    face: 'face7.jpeg'
  };

  export const personaL = {
    key: 'l',
    name: 'Larry Leclerc',
    face: 'face2.jpeg',
    member: false
  }

  export const personaRobo = {
    key: 'robo',
    name: 'Robot',
    face: 'robo.jpeg'
  };





export const defaultPersona = 'a';

export const defaultPersonaList = [personaA, personaB, personaC, personaD, personaE, personaF, 
    personaG, personaH, personaI,personaJ, personaK, personaL, personaRobo]

export const memberPersonaList = [adminA, memberB, memberC, personaD, personaE, personaF,
    personaG, personaH, personaI, personaJ, personaK, personaL, personaRobo]

export const adminPersonaList = [adminA, personaB, personaC, personaD, personaE, personaF,
    personaG, personaH, personaI, personaJ, personaK, personaL, personaRobo]
  


export function personaListToMap(personas) {
    const result = {};
    personas.forEach(persona => result[persona.key] = deepClone(persona));
    return result;
}

