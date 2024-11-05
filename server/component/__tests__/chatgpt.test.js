jest.mock('fs');

const { post } = require("axios");
const { callOpenAIAsync, callGptAsync, createGptPrompt, getEmbeddingsAsync, getEmbeddingsArrayAsync, setGptKey, getGptJsonAsync } = require("../chatgpt");
const { readFileSync, existsSync } = require("fs");

test('createGptPrompt', () => {
    readFileSync.mockReturnValue('What is your favorite {{thing}}?');
    existsSync.mockReturnValue(true);
    const result = createGptPrompt({promptKey: 'favorite', params: {thing: 'animal'}});
    expect(result).toBe('What is your favorite animal?');
});

test('callOpenAIAsync', async () => {
    post.mockResolvedValue({data: 'Result'});
    setGptKey('key');

    const result = await callOpenAIAsync({action: 'chat/completions', data: {
        property: 'whatever'
    }});

    expect(result).toEqual('Result');
});

test('callGptAsync', async () => {
    readFileSync.mockResolvedValue('What is your favorite {{thing}}?');
    existsSync.mockReturnValue(true);
    post.mockResolvedValue({data: {
        choices: [{message: {content: 'I like cats'}}]
    }});

    const result = await callGptAsync({
        promptKey: 'favorite', params: {thing: 'animal'}
    });
    expect(result).toEqual('I like cats');
});

test('getGptJsonAsync', async () => {
    readFileSync.mockReturnValue('What is your favorite {{thing}}?');
    post.mockResolvedValue({data: {
        choices: [{message: {content: '{"a": 1}'}}]
    }});
    const result = await getGptJsonAsync({
        promptKey: 'favorite', params: {thing: 'animal'}, 
        language: 'English', model: 'gpt4'});
    expect(result).toEqual({a: 1});
});

test('getEmbeddingAsync', async () => {
    post.mockResolvedValue({data: {data: [
        {embedding: [1,2,3]}
    ]}});

    const result = await getEmbeddingsAsync({text: 'Hello'});
    expect(result).toEqual({data: [1,2,3]});
});

test('getEmbeddingsArrayAsync', async () => {
    post.mockResolvedValue({data: {data: [
        {embedding: [1,2,3]},
        {embedding: [4,5,6]}
    ]}});
    const result = await getEmbeddingsArrayAsync({textArray: ['Hello', 'World']});
    expect(result).toEqual({data: [[1,2,3], [4,5,6]]});
}); 