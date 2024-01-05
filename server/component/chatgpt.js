const { readFileSync, existsSync } = require('fs');
// const keys = require('../keys');
const Mustache = require('mustache');
const { extractAndParseJSON } = require('../util/messyjson');

var openai_key = null;

function setGptKey(key) {
    openai_key = key;
}
exports.setGptKey = setGptKey;

async function callOpenAIAsync({action, data}) {
    const fetch = await import('node-fetch');

    const url = 'https://api.openai.com/v1/' + action;
    const response = await fetch.default(url, {
        headers: {
            'Authorization': 'Bearer ' + openai_key,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })        
    return await response.json();
}


async function helloAsync({name}) {
    return {data: "Hello " + name};
}

function createGptPrompt({promptKey, params, language='English', model=null}) {
    console.log('createGptPrompt', {promptKey});
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

function selectModel(model) {
    switch (model) {
        case 'gpt4': return 'gpt-4';
        // case 'gpt4': return 'gpt-4-1106-preview'
        // case 'gpt4': return 'gpt-4-0613'	
        // default: return 'gpt-3.5-turbo-1106'
        // default: return 'gpt-3.5-turbo-0613';
        default: return 'gpt-3.5-turbo';
    }
}

async function callGptAsync({promptKey, params, language, model, json_mode=false}) {
    console.log('callGptAsync', {promptKey})

    const prompt = createGptPrompt({promptKey, params, language, model});
    if (!prompt) {
        return {success: false, error: 'Unknown prompt: ' + promptKey}
    }

    // console.log('prompt', prompt);
    const result = await callOpenAIAsync({action: 'chat/completions', data: {
        temperature: 0,
        model: selectModel(model),
        // response_format: { type: json_mode ? 'json_object' : 'text' },
        max_tokens: 1000,
        messages: [
            {role: 'user', content: prompt}
        ]
    }});
    if (!result.choices) {
        console.error('result', result);
        return {success: false, error: result.error}
    }
    // console.log('result', result);
    // console.log(result.choices?.[0]?.message?.content);
    const data = result.choices?.[0]?.message?.content;

    return {data};
}

exports.callGptAsync = callGptAsync;


async function getGptJsonAsync({promptKey, params, language, model}) {
    const result = await callGptAsync({promptKey, params, language, model, json_mode: true});
    const json = extractAndParseJSON(result.data);
    return json;
}
exports.getGptJsonAsync = getGptJsonAsync;


async function conversationAsync({messages}) {
    // const messages = params.messages;
    console.log('conversationAsync', messages);
    const result = await callOpenAIAsync({action: 'chat/completions', data: {
        temperature: 0,
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        messages: messages
    }});
    console.log('result', result);
    console.log(result.choices?.[0]?.message?.content);
    const data = result.choices?.[0]?.message?.content;
    return {data}
}

async function getEmbeddingsAsync({text}) {
    const result = await callOpenAIAsync({action: 'embeddings', data: {
        input: text,
        'model': 'text-embedding-ada-002'
    }});
    // console.log('result', result);
    if (result.data?.[0].embedding) {
        return {data: result.data?.[0].embedding};
    } else {
        console.error('OpenAI Embeddings error', result.error)
        return {success: false, error: result.error}
    }
}
exports.getEmbeddingsAsync = getEmbeddingsAsync;

async function getEmbeddingsArrayAsync({textArray}) {
    // console.log('textArray', textArray);
    const expandEmptyTextArray = textArray.map(t => t || ' ');
    const result = await callOpenAIAsync({action: 'embeddings', data: {
        input: expandEmptyTextArray,
        'model': 'text-embedding-ada-002'
    }});
    // console.log('result', result);
    // console.log('result', result);
    if (result.data?.[0].embedding) {
        const embeddings = result.data.map(d => d.embedding)
        return {data: embeddings};
    } else {
        console.error('OpenAI Embeddings error', result.error)
        return {success: false, error: result.error}
    }
}
exports.getEmbeddingsArrayAsync = getEmbeddingsArrayAsync;




exports.apiFunctions = {
    hello: helloAsync,
    chat: callGptAsync,
    conversation: conversationAsync,
    embedding: getEmbeddingsAsync,
    embeddingArray: getEmbeddingsArrayAsync
}


