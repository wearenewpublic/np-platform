import { addKey, collapseDoubleSpaces, isNonEmpty, removeKey, removeNullProperties, stripSuffix } from "../util";

jest.mock('../firebase');

test('removeKey', () => {
    const collection = {a: 1, b: 2, c: 3};
    const result = removeKey(collection, 'b');
    expect(result).toEqual({a: 1, c: 3});
})

test('addKey', () => {
    const collection = {a: 1, b: 2, c: 3};
    const result = addKey(collection, 'd', 4);
    expect(result).toEqual({a: 1, b: 2, c: 3, d: 4});
})

test('isNonEmpty', () => {
    expect(isNonEmpty({a: 1,b: 2})).toBe(true);
    expect(isNonEmpty({})).toBe(false);
})

test('removeNullProperties', () => {
    const obj = {a: 1, b: null, c: 3};
    const result = removeNullProperties(obj);
    expect(result).toEqual({a: 1, c: 3});
});

test('stripSuffix', () => {
    expect(stripSuffix('hello.txt', '.txt')).toBe('hello');
    expect(stripSuffix('hello.txt', '.jpg')).toBe('hello.txt');
});

