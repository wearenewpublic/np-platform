
import { getGlobalParams } from '../navigate';
import { getParamsWithSuffix } from '../navigate';

test('getGlobalParams', () => {
    const url = "https://www.example.com?foo=bar&baz=qux&bla_g=blu";
    const result = getGlobalParams(url);
    expect(result).toEqual({bla: 'blu'});  
})

test('getParamsWithSuffix', () => {
    const urlParams = new URLSearchParams('foo=bar&baz=qux&bla_g=blu');
    const result = getParamsWithSuffix(urlParams, '_g');
    expect(result).toEqual({bla: 'blu'});
})

