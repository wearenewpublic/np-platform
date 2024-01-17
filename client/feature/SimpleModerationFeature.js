import { UtilityText } from "../component/text";
import { pauseAsync } from "../util/util";

export const SimpleModerationFeature = {
    name: 'Simple Moderation',
    key: 'simplemoderation',
    config: {
        commentPostCheckers: [checkPostAsync],
        commentEditWidgets: [BadWords]
    }
}

const badwords = 'cat,dog,carrot';

async function checkPostAsync({datastore, comment, setComment}) {
    await pauseAsync(1000);
    const badwordList = badwords.split(',');
    for (let word of badwordList) {
        if (comment.text.includes(word)) {
            setComment({...comment, badWord: word});
            return true;
        }
    };
    setComment({...comment, badWord: null});
    return false;
}

function BadWords({comment}) {
    if (!comment.badWord) {
        return null;
    } else {
        return <UtilityText label='Your post contains a bad word: {badWord}' formatParams={{badWord: comment.badWord}} />
    }

}
