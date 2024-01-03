
const { readMultipleCollectionsAsync } = require('../util/firebaseutil');
const {ArticleQuestionsAnswerSummary} = require('./articlequestions');

const derived_views = [
    ArticleQuestionsAnswerSummary,
]
exports.derived_views = derived_views;
