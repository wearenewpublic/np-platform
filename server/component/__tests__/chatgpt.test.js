const { callOpenAIAsync } = require("../chatgpt");
const { fetch } = require('node-fetch');

jest.mock('node-fetch');

// TODO: Get rid of the dynamic import in callOpenAIAsync so we can test it properly
test('callOpenAIAsync', async () => {
    // fetch.mockResolvedValue(JSON.stringify({hello: 'world'}));
    // const result = await callOpenAIAsync({action: 'chat/completions', data: {
    //     temperature: 0,
    //     model: 'gpt-3.5-turbo',
    //     max_tokens: 1000,
    //     messages: ['Hello', 'How are you?']
    // }});
    // expect(result).toEqual({hello: 'world'});
});
