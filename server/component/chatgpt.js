const { readFileSync, existsSync } = require('fs');
const Mustache = require('mustache');
const { extractAndParseJSON } = require('../util/messyjson');
const axios = require('axios');


var openai_key = null;

function setGptKey(key) {
    openai_key = key;
}
exports.setGptKey = setGptKey;

async function callOpenAIAsync({ action, data }) {
    const url = 'https://api.openai.com/v1/' + action;
    const response = await axios.post(url, data, {
        headers: {
            'Authorization': 'Bearer ' + openai_key,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}
exports.callOpenAIAsync = callOpenAIAsync;

function createGptPrompt({promptKey, params, language='English', model=null}) {
    const modelPrefix = (model == 'gpt4') ? 'gpt4/' : ''
    const filename = 'prompts/' + modelPrefix + promptKey + '.txt';
    if (!existsSync(filename)) {
        console.log('file does not exist', filename);
        return null;
    }
    const promptTemplate = readFileSync(filename).toString();  
    const prompt = Mustache.render(promptTemplate, {...params, language});
    return prompt;
}
exports.createGptPrompt = createGptPrompt;

function selectModel(model) {
    switch (model) {
        case 'gpt4': return 'gpt-4-turbo';
        default: return 'gpt-4o-mini';
    }
}

async function callGptAsync({promptKey, params, language, model, json_mode=false}) {
    const prompt = createGptPrompt({promptKey, params, language, model});
    if (!prompt) {throw new Error('Unknown prompt: ' + promptKey)}

    const result = await callOpenAIAsync({action: 'chat/completions', data: {
        temperature: 0,
        model: selectModel(model),
        response_format: { type: json_mode ? 'json_object' : 'text' },
        max_tokens: 1000,
        messages: [
            {role: 'user', content: prompt}
        ]
    }});
    if (!result.choices) {
        throw new Error('Bad response from OpenAI: ' + JSON.stringify(result));
    }
    return result.choices?.[0]?.message?.content;
}

exports.callGptAsync = callGptAsync;


async function getGptJsonAsync({promptKey, params, language, model}) {
    const result = await callGptAsync({promptKey, params, language, model, json_mode: true});
    const json = extractAndParseJSON(result);
    return json;
}
exports.getGptJsonAsync = getGptJsonAsync;

async function getEmbeddingsAsync({text}) {
    const result = await callOpenAIAsync({action: 'embeddings', data: {
        input: text,
        'model': 'text-embedding-ada-002'
    }});    
    if (result.data?.[0].embedding) {
        return {data: result.data?.[0].embedding};
    } else {
        throw new Error('OpenAI Embeddings error: ' + JSON.stringify(result));
    }
}
exports.getEmbeddingsAsync = getEmbeddingsAsync;

async function getEmbeddingsArrayAsync({textArray}) {
    const expandEmptyTextArray = textArray.map(t => t || ' ');
    const result = await callOpenAIAsync({action: 'embeddings', data: {
        input: expandEmptyTextArray,
        'model': 'text-embedding-ada-002'
    }});
    if (result.data?.[0].embedding) {
        const embeddings = result.data.map(d => d.embedding)
        return {data: embeddings};
    } else {
        throw new Error('OpenAI Embeddings error: ' + JSON.stringify(result));
    }
}
exports.getEmbeddingsArrayAsync = getEmbeddingsArrayAsync;




exports.publicFunctions = {
    chat: callGptAsync,
    embedding: getEmbeddingsAsync,
    embeddingArray: getEmbeddingsArrayAsync
}


