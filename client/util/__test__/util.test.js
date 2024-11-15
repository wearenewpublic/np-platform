import { addKey, boolToInt, boolToString, forEachAsync, generateRandomKey, getObjectPropertyPath, isNonEmpty, removeKey, removeNullProperties, setObjectPropertyPath, sortBy, stringToBool, stripSuffix } from "../util";

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
    const result2 = addKey(collection, 'd');
    expect(result2).toEqual({a: 1, b: 2, c: 3, d: true});
})

test('isNonEmpty', () => {
    expect(isNonEmpty({a: 1,b: 2})).toBe(true);
    expect(isNonEmpty({})).toBe(false);
    expect(isNonEmpty(null)).toBe(false);
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

test('boolToInt', () => {
    expect(boolToInt(true)).toBe(1);
    expect(boolToInt(false)).toBe(0);
    expect(boolToInt(null)).toBe(0);
})

test('getObjectPrepertyPath', () => {
    const obj = {a: {b: {c: 1}}};
    expect(getObjectPropertyPath(obj, ['a','b','c'])).toBe(1);
    expect(getObjectPropertyPath(obj, ['a','b','d'])).toBe(undefined);
    expect(getObjectPropertyPath(obj, ['a','b'])).toEqual({c: 1});
})

test('setObjectPropertyPath', () => {
    const obj = {a: {b: {c: 1}}};
    const result = setObjectPropertyPath(obj, ['a','b','c'], 2);
    expect(result).toEqual({a: {b: {c: 2}}});
    const result2 = setObjectPropertyPath(obj, ['a','b','d'], 3);
    expect(result2).toEqual({a: {b: {c: 1, d: 3}}});
})

test('generateRandomKey', () => {
    Object.defineProperty(window, 'crypto', {
        value: {
            getRandomValues: jest.fn((arr) => {
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = i; 
                }
                return arr;
            })
        }
    });
    const key = generateRandomKey(10);
    expect(key).toMatch('ABCDEFGHIJ');
});

test('sortBy', () => {
    const array = [{a: 1}, {a: 3}, {a: 2}];
    const result = sortBy(array, 'a');
    expect(result).toEqual([{a: 1}, {a: 2}, {a: 3}]);
});
