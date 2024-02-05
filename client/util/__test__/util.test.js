import { addKey, boolToString, forEachAsync, isNonEmpty, removeKey, removeNullProperties, stringToBool, stripSuffix } from "../util";

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

test('forEachAsync', async () => {
    const array = [1, 2, 3];
    let result = [];
    await forEachAsync(array, async (item, index, array) => {
        result.push(item);
    });
    expect(result).toEqual(array);
})

test('boolToString', () => {
    expect(boolToString(true)).toBe('true');
    expect(boolToString(false)).toBe('false');
    expect(boolToString(null)).toBe('false');
})

test('stringToBool', () => {
    expect(stringToBool('true')).toBe(true);
    expect(stringToBool('false')).toBe(false);
    expect(stringToBool(null)).toBe(false);
})

    