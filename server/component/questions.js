const unfluff = require('unfluff');
const { callGptAsync, getEmbeddingsArrayAsync, getEmbeddingsAsync, getGptJsonAsync } = require('./chatgpt');
const { stringToFbKey, fbKeyToString, writeCollectionAsync, readInstanceAsync, createInstanceAsync, setObjectAsync, readGlobalAsync, writeGlobalAsync, firebaseUpdateAsync, firebaseReadAsync } = require('../util/firebaseutil');
const { sortEmbeddingsByDistance } = require('../util/embedding');

const prototypeArticleQuestions = 'articlequestions';
const prototypeQuestion = 'question';

async function fetchAndParseArticle(url) {
    const fetch = await import('node-fetch');
    const response = await fetch.default(url);
    const html = await response.text();
    return unfluff(html);
}

async function generateQuestionsAsync({instanceKey}){
    console.log('generateQuestionsAsync', instanceKey);
    const url = fbKeyToString(decodeURIComponent(instanceKey));
    const inProgress= await readGlobalAsync({prototype: prototypeArticleQuestions, 
        instance: instanceKey, key:'inProgress'});
    const tenSecondsAgo = Date.now() - 10 * 1000;
    if (inProgress && inProgress > tenSecondsAgo) {
        console.log('Generation already in progress');
        return {data: {inProgress: true}}
    }
    await writeGlobalAsync({prototype: prototypeArticleQuestions, 
        instance: instanceKey, key:'inProgress', value: Date.now()})

    const article = await fetchAndParseArticle(url);
    console.log('article', article);
    var text = article.text;
    if (url.includes('www.zdf.de')) {
        console.log('ZDF content - falling back to description');
        text = article.description;
    }
    const articleEmbedding = (await getEmbeddingsArrayAsync({textArray: [text]}))?.data?.[0];
    // console.log('article embedding', articleEmbedding);

    const questions = await getGptJsonAsync({promptKey: 'article_questions',
        params: {text, title: article.softTitle},
        language: 'English', model: 'gpt4'});
    const questionEmbeddings = (await getEmbeddingsArrayAsync({textArray: questions}))?.data;

    // console.log('questions', questions);
    // console.log('question embeddings', questionEmbeddings);

    // const questionArray = JSON.parse(questions);
    const questionObjects = createQuestionObjects(questions);
    // console.log('questionobjects', questionObjects);
    const pQStore = updateQuestionStoreAsync({questions, questionEmbeddings});
    const pAStore = updateArticleStoreAsync({instanceKey, title: article.softTitle, image: article.image, articleEmbedding});
    const pWrite = writeCollectionAsync({prototype: prototypeArticleQuestions, instance: instanceKey, 
        collection: 'question', items: questionObjects}); 
    const pImage = writeGlobalAsync({prototype: prototypeArticleQuestions, instance: instanceKey, 
        key: 'image', value: article.image});
    const pTitle = writeGlobalAsync({prototype: prototypeArticleQuestions, instance: instanceKey,
        key: 'title', value: article.softTitle});
    await createMissingConversationsAsync({questions, url, urlKey:instanceKey, 
        title: article.softTitle, image: article.image});
    await pWrite; await pQStore; await pAStore; await pImage; await pTitle;
    return {data: {article, questions, time: Date.now()}}
}


async function updateArticleStoreAsync({instanceKey, title, image, articleEmbedding}) {
    await firebaseUpdateAsync('/dataset/article/' + instanceKey, {
        title, image, embedding: JSON.stringify(articleEmbedding)});
}

async function updateQuestionStoreAsync({questions, questionEmbeddings}) {
    var output = {}
    questions.forEach((question, i) => {
        const key = questionToKey(question);
        output[key] = {question, embedding: JSON.stringify(questionEmbeddings?.[i])}
    });
    await firebaseUpdateAsync('/dataset/question', output);
}


function questionToKey(question) {
    return stringToFbKey(question.toLowerCase().trim().replace(/ /g,'-').replace('?', ''));
}

async function createConversationIfMissing({question, url, urlKey, title, image}) {
    const questionKey = questionToKey(question);
    // const urlKey = stringToFbKey(url);
    const current = await readInstanceAsync({prototype: prototypeQuestion, instance: questionKey});
    if (current) {
        return await setObjectAsync({prototype: prototypeQuestion, instance: questionKey, 
            collection: 'derived_article', key: urlKey, value: {
                url, title, image, key: urlKey
            }});
    } else {
        return await createInstanceAsync({prototype: prototypeQuestion, instance: questionKey, 
            global: {
                name: question
            },
            collection: {
                derived_article: {
                    [urlKey]: {
                        url, title, image, key: urlKey
                    }
                }                
            }
        })
    }
}

async function createMissingConversationsAsync({questions, url, urlKey, title, image}) {
    await Promise.all(questions.map(question => 
        createConversationIfMissing({question, url, urlKey, title, image})
    ));
}

function createQuestionObjects(questions) {
    const time = Date.now();
    var collection = {};

    questions.forEach(question => {
        const key = questionToKey(question);
        const obj = ({from: 'robo', text: question, time, key})
        collection[key] = obj;
    });
    return collection;
}


async function getMatchingQuestionsAsync({text}) {
    const questions = await firebaseReadAsync('/dataset/question');
    var embeddingMap = {};
    Object.keys(questions).forEach(key => {
        embeddingMap[key] = JSON.parse(questions[key].embedding);
    });
    const textEmbedding = (await getEmbeddingsAsync({text})).data;
    console.log('textEmbedding', textEmbedding);
    const sorted = sortEmbeddingsByDistance(null, textEmbedding, embeddingMap);
    var resultList = [];
    sorted.slice(0, 10).forEach(item => {
        const question = questions[item.key];
        if (item.distance < 0.4) {
            resultList.push({key: item.key, questionText: question.question, distance: item.distance});
        }
    });
    console.log('sorted', sorted);
    return {data: resultList};
}

async function addQuestionAsync({userId, instanceKey, question}) {
    console.log('addQuestionAsync', {userId, instanceKey, question});
    const questionKey = questionToKey(question);
    const urlKey = instanceKey;
    const url = fbKeyToString(decodeURIComponent(instanceKey));
    console.log('url', url);
    const articleData = await firebaseReadAsync('/dataset/article/' + instanceKey);
    console.log('articleData', articleData);
    const title = articleData.title;
    const image = articleData.image || null;
    const pQuestionData = firebaseReadAsync('/dataset/question/' + questionKey);
    const conversation = await readInstanceAsync({prototype: prototypeQuestion, instance: questionKey});
    if (!conversation) {
        console.log('creating conversation');
        await createConversationIfMissing({question, url, title, image, urlKey});
    }
    const questionData = await pQuestionData;
    console.log('questionData', questionData);
    if (!questionData) {
        console.log('adding question to dataset');
        const embedding = (await getEmbeddingsAsync({text: question})).data;
        await firebaseUpdateAsync('/dataset/question/' + questionKey, {
            from: userId,
            question, embedding: JSON.stringify(embedding)
        });
    }
    const pDerivedArticle = setObjectAsync({prototype: prototypeQuestion, instance: questionKey, 
        collection: 'derived_article', key: instanceKey, value: {
            url, title, image, key: instanceKey
        }});
    console.log('wrote derived article');
    const pWrite = setObjectAsync({prototype: prototypeArticleQuestions, instance: instanceKey, 
        collection: 'question', key: questionKey, value: {
            from: userId, text: question, origFrom: questionData?.from || null,
            time: Date.now(), key: questionKey                        
        }}); 
    console.log('added question to article');
    await pDerivedArticle; await pWrite;
    console.log('SUCCESS: addQuestionAsync', {userId, instanceKey, question});
    return {success: true}
}



exports.apiFunctions = {
    generate: generateQuestionsAsync,
    similar: getMatchingQuestionsAsync,
    add: addQuestionAsync,
}

