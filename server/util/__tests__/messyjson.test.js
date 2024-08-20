const { extractAndParseJSON } = require("../messyjson");

test('well formed JSON', () => {
    const json = `{"foo": "bar"}`;
    const result = extractAndParseJSON(json);
    expect(result).toEqual({foo: 'bar'});
})

test('JSON with prefix', () => {
    const json = `The answer is {"foo": "bar"}`;
    const result = extractAndParseJSON(json);
    expect(result).toEqual({foo: 'bar'});
})

test('Unescaped quotes', () => {
    const json = `The answer is {"foo": "John "the Man" Smith", "bar": "baz"}`;
    const result = extractAndParseJSON(json);
    expect(result).toEqual({foo: 'John "the Man" Smith', bar: 'baz'});
})

