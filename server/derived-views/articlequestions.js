
const ArticleQuestionsAnswerSummary = {
    input: {
        structure: 'question',
        triggerType: 'comment',
        inputCollections: ['comment', 'persona', 'derived_article']
    },
    output: {
        structure: 'articlequestions',
        type: 'derived_answerSummary',
    },
    dependencies: ['derived_article'],
    triggerMode: 'lastWrite',
    trigger: QuestionCommentTrigger,
}
exports.ArticleQuestionsAnswerSummary = ArticleQuestionsAnswerSummary;

function QuestionCommentTrigger({datastore, instanceKey: questionKey, value: comment}) {
    const summary = {
        commentCount: datastore.getCollection('comment').length,
        lastPhotos: JSON.stringify(datastore.getCollection('persona').slice(0,3).map(p => p.photoUrl)),
        time: comment.time,
        key: questionKey,
        question: questionKey
    }
    datastore.getCollection('derived_article').forEach(article =>
        datastore.setObject({
            structureKey: 'articlequestions',
            instanceKey: article.key, 
            type: 'derived_answerSummary',
            key: questionKey, 
            value: summary})
    )
}

