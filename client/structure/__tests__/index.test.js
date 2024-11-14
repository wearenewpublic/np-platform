import { addStructures, structures, UNSAFE_setStructures } from ".."

test('addStructures', () => {
    const oldStructures = structures;

    addStructures({key: 'test', name: 'Test'})
    expect(structures.find(s => s.key == 'test')).toBeTruthy();
    UNSAFE_setStructures(oldStructures);
})
