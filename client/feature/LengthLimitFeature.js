import { CharacterCounter } from "../component/text";

export const LengthLimitFeature = {
    name: 'Comment Length Limit',
    key: 'lengthlimit',
    config: {
        commentEditWidgets: [CommentLengthLimit],
        commentPostBlockers: [isCommentLengthBlocked]
    }
}

const minLength = 100;
const maxLength = 1000;

function CommentLengthLimit({comment, setComment}) {
    return <CharacterCounter text={comment.text} min={minLength} max={maxLength} />
}

function isCommentLengthBlocked({comment}) {
    const length = comment?.text?.length;
    return (length < minLength) || (length > maxLength)
}