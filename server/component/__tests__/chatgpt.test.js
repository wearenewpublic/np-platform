const { post } = require("axios");
const { callOpenAIAsync, callGptAsync, createGptPrompt } = require("../chatgpt");
const { readFileSync, existsSync } = require("fs");

test('callOpenAIAsync', async () => {
    post.mockResolvedValue({data: 'Result'});

    const result = await callOpenAIAsync({action: 'chat/completions', data: {
        property: 'whatever'
    }});

    expect(result).toEqual('Result');
});

test('createGptPrompt', () => {
    readFileSync.mockReturnValue('What is your favorite {{thing}}?');
    existsSync.mockReturnValue(true);
    const result = createGptPrompt({promptKey: 'favorite', params: {thing: 'animal'}});
    expect(result).toBe('What is your favorite animal?');
    expect(readFileSync).toBeCalledWith('prompts/favorite.txt');
});


test('callOpenAIAsync', async () => {
    readFileSync.mockResolvedValue('What is your favorite {{thing}}?');
    existsSync.mockReturnValue(true);
    post.mockResolvedValue({data: {
        choices: [{message: {content: 'I like cats'}}]
    }});

    const result = await callGptAsync({
        promptKey: 'favorite', params: {thing: 'animal'}
    });
    expect(result).toEqual({data: 'I like cats'});
});

