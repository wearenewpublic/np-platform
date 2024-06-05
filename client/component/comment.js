import React, { useContext, useState } from "react";
import { useCollection, useDatastore, useObject, usePersona, usePersonaKey, useSessionData } from "../util/datastore"
import { Byline, FacePile, Persona } from "./people"
import { Card, ConversationScreen, PadBox, Pad, HorizBox, Separator } from "./basics";
import { CharacterCounter, Heading, Paragraph, TextField, TextFieldButton, UtilityText, checkValidLength } from "./text";
import { CTAButton, ExpandButton, IconButton, SubtleButton, TextButton } from "./button";
import { IconEdit, IconReply, IconReport, IconUpvote, IconUpvoted } from "./icon";
import { goBack, pushSubscreen } from "../util/navigate";
import { StyleSheet, Text, View } from "react-native";
import { deepClone, getFirstName } from "../util/util";
import { colorBlueBackground, colorDisabledText, colorGreyPopupBackground, colorLightBlueBackground, colorPurpleBackground, colorTeaserBackground, colorTextBlue, colorTextGrey } from "./color";
import { RichText } from "./richtext";
import { CatchList, Catcher } from "./catcher";
import { TopBarActionProvider } from "../organizer/TopBar";
import { needsLogin } from "../organizer/Login";
import { useConfig } from "../util/features";
import { Banner } from "./banner";
import { logEventAsync, useLogEvent } from "../util/eventlog";


export function Comment({commentKey}) {
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    const {commentAboveWidgets, commentBelowWidgets} = useConfig();
    return <View testID={commentKey} id={commentKey} >
        <PadBox top={20} horiz={10}>
            {commentAboveWidgets?.map((Widget,i) => <Widget key={i} comment={comment}/>)}
            <Byline type='large' userId={comment.from} time={comment.time} edited={comment.edited} />
            <Pad size={20} />
            <PadBox left={48}>
                <Catcher><CommentBody commentKey={commentKey} /></Catcher>
                {commentBelowWidgets?.map((Widget,i) => <Widget key={i} comment={comment}/>)}
                {!editing && <PadBox top={20}><CommentActions commentKey={commentKey} /></PadBox>}
                <MaybeCommentReply commentKey={commentKey} />
                <CommentReplies commentKey={commentKey} />
            </PadBox>
        </PadBox>
        <PadBox horiz={30}><Separator /></PadBox>
    </View>
}

export function ReplyComment({commentKey, depth={depth}, isFinal=false}) {
    const s = ReplyCommentStyle;
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    const {replyAboveWidgets} = useConfig();
    return <View testID={commentKey} style={depth == 1 ? s.firstLevel : s.secondLevel}>
        {replyAboveWidgets?.map((Widget,i) => <Widget key={i} comment={comment}/>)}
        <Byline type='small' userId={comment.from} time={comment.time} edited={comment.edited} />
        <Pad size={20} />
        <PadBox left={40}>
            <CommentBody commentKey={commentKey} />
            <Pad size={20} />
            {!editing && <CommentActions commentKey={commentKey} depth={depth} />}
            <MaybeCommentReply commentKey={commentKey} />
            <CommentReplies commentKey={commentKey} depth={depth+1} />
        </PadBox>
        {!isFinal && <Separator />}
    </View>    
}

const ReplyCommentStyle = StyleSheet.create({
    firstLevel: {
        paddingTop: 20
    },
    secondLevel: {
        paddingTop: 10,
    }
})


function CommentBody({commentKey}) {
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    const [editedComment, setEditedComment] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const datastore = useDatastore();
    const {commentTopWidgets} = useConfig();
    const text = comment.text || '';
    const isLong = text.length > 300 || text.split('\n').length > 5;

    function onEditingDone(finalComment) {
        setEditedComment(null);
        logEventAsync(datastore, 'edit-finish', {commentKey, text: finalComment.text});
        datastore.updateObject('comment', comment.key, {...finalComment, edited: Date.now()});
        datastore.setSessionData(['editComment', comment.key], false);
    }

    function onCancel() {
        logEventAsync(datastore, 'edit-cancel', {commentKey});
        setEditedComment(null);
        datastore.setSessionData(['editComment', comment.key], false);
    }

    if (editing) {
        return <EditComment comment={editedComment ?? comment} 
                setComment={setEditedComment} 
                onCancel={onCancel} onEditingDone={onEditingDone} />
    } else {
        return <View>
            {commentTopWidgets?.map((Widget,i) => <Widget key={i} comment={comment}/>)}
            {/* <Paragraph numberOfLines={(isLong && !expanded) ? 5 : null} text={comment.text.trim()} /> */}
            <RichText numberOfLines={(isLong && !expanded) ? 5 : null} text={text.trim()} />
            {isLong && !expanded && <PadBox top={14}><TextButton type='small' label='Read more' color={colorTextBlue} onPress={() => setExpanded(true)} /></PadBox>}
        </View>
    }
}

function MaybeCommentReply({commentKey}) {
    const replyEnabled = useSessionData(['replyToComment', commentKey]);
    const personaKey = usePersonaKey();
    const [comment, setComment] = useState({text: '', replyTo: commentKey});
    const datastore = useDatastore();
    if (!replyEnabled) return null;

    function onEditingDone(finalComment) {
        logEventAsync(datastore, 'reply-finish', {commentKey, text: finalComment.text});
        datastore.setSessionData(['replyToComment', comment.replyTo], false);
        datastore.setSessionData(['showReplies', comment.replyTo], true);
        datastore.addObject('comment', finalComment);
        setComment({text: '', replyTo: commentKey})
    }

    function onCancel() {
        datastore.setSessionData(['replyToComment', comment.replyTo], false);
        setComment({text: '', replyTo: commentKey})
    }

    return <View>
        <Pad size={20} />
        <Byline type='small' userId={personaKey} />
        <Pad size={20} />
        <PadBox left={24}>
            <EditComment comment={comment} onCancel={onCancel}
                setComment={setComment} onEditingDone={onEditingDone} />
        </PadBox>
    </View>
}

function EditComment({comment, big=false, setComment, topLevel, onEditingDone, onCancel, min=100, max=1000}) {
    const personaKey = usePersonaKey();
    const datastore = useDatastore();
    const replyToComment = useObject('comment', comment.replyTo);
    const author = useObject('persona', replyToComment?.from);
    const [inProgress, setInProgress] = useState(false);
    const {commentReplyPlaceholder, commentInputPlaceholder, 
        commentPostBlockers, commentPostCheckers,
        commentEditBottomWidgets, commentEditTopWidgets,
        commentAllowEmpty
        } = useConfig();

    const isBlocked = commentPostBlockers.some(blocker => blocker({datastore, comment}));
    const canPost = (comment.text || commentAllowEmpty) && !isBlocked;
    const action = comment.key ? 
          (inProgress ? 'Updating...' : 'Update') 
        : (inProgress ? 'Posting...' : 'Post');
    const placeholder = comment.replyTo ? commentReplyPlaceholder : commentInputPlaceholder;
    
    async function onPost() {
        if (commentPostCheckers?.length) {
            setInProgress(true);
            const checkResults = await Promise.all(commentPostCheckers.map(checker =>
                checker({datastore, comment})
            ))
            var finalComment = {...comment};
            checkResults.forEach(judgement => {
                finalComment = {...finalComment, ...judgement.commentProps}
            })
            // console.log('finalComment', finalComment);
            if (checkResults.every(x => x.allow)) {
                onEditingDone(finalComment);
            } else {
                setComment(finalComment);
            }
            setInProgress(false);
        } else {
            onEditingDone(comment);
        }
    }

    return <View>
        {topLevel && <TopBarActionProvider label={action} disabled={!canPost || inProgress} onPress={onPost} />}
        <EditWidgets widgets={commentEditTopWidgets} comment={comment} setComment={setComment} onCancel={onCancel} />
        {big && <EditWidgets widgets={commentEditBottomWidgets} comment={comment} setComment={setComment} onCancel={onCancel} />}
        <TextField value={comment.text} onChange={text => setComment({...comment, text})} 
            placeholder={placeholder} autoFocus big={big}
            placeholderParams={{authorName: getFirstName(author?.name)}} />
        <Pad size={12} />
        {!big && <EditWidgets widgets={commentEditBottomWidgets} comment={comment} setComment={setComment} onCancel={onCancel} />}
        {personaKey &&
            <PadBox top={20} >
                <HorizBox center spread>
                    <Pad />
                    {!topLevel && 
                        <HorizBox center right>
                            {onCancel && <PadBox right={20}><TextButton color={colorTextGrey} label='Cancel' onPress={onCancel} /></PadBox>}
                            <CTAButton label={action} disabled={!canPost || inProgress} type='primary' onPress={onPost} />
                        </HorizBox>
                    }
                </HorizBox>                        
            </PadBox>
        }
    </View>
}

function EditWidgets({widgets, comment, setComment, onCancel}) {
    return <View>
        {widgets?.map((Widget, idx) => <View key={idx}>
            <Catcher>
                <Widget comment={comment} setComment={setComment} onCancel={onCancel} />
            </Catcher>
        </View>)} 
    </View>
}

function CommentReplies({commentKey, depth=1}) {
    const {replyFilters} = useConfig();
    const datastore = useDatastore();
    var replies = useCollection('comment', {filter: {replyTo: commentKey}, sortBy: 'time', reverse: true});
    replies = filterComments({datastore, comments: replies, commentFilters: replyFilters});
    const replyUsers = replies.map(reply => reply.from);
    const expanded = useSessionData(['showReplies', commentKey]);

    function setExpanded(expanded) {
        datastore.setSessionData(['showReplies', commentKey], expanded);
        if (expanded) {
            logEventAsync(datastore, 'showReplies', {commentKey});
        }
    }

    if (replies.length == 0) return <Pad />;
    
    return <View>
        <Pad />
        {/* <PadBox horiz={depth==1 ? 20 : 0} top={20}> */}
            <ExpandButton userList={replyUsers} label='{count} {noun}' 
                expanded={expanded} setExpanded={setExpanded}
                formatParams={{count: replies.length, singular: 'reply', plural: 'replies'}} />
        {/* </PadBox> */}
        <Pad />
        {expanded && <Separator />}
        {expanded && <CatchList items={replies} 
            renderSeparator={() => <PadBox left={20}><Separator /></PadBox>}
            renderItem={(reply,isFinal) =>
                <ReplyComment commentKey={reply.key} depth={depth} isFinal={isFinal} />
            } 
        />}
    </View>
}


function CommentActions({commentKey, depth}) {
    const s = CommentActionsStyle;
    const {commentActions, commentRightActions} = useConfig();
    return <View style={s.actionBar}>
        <View style={s.mainActions}>
            {commentActions?.map((Action, idx) => <Action key={idx} commentKey={commentKey} depth={depth} />)}
        </View>
        <View style={s.rightActions}>
            {commentRightActions?.map((Action, idx) => <Action key={idx} commentKey={commentKey} depth={depth} />)}
        </View>
    </View>
}
const CommentActionsStyle = StyleSheet.create({
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mainActions: {
        flexDirection: 'row',
    },
    rightActions: {
        flexDirection: 'row',
    },
    leftAction: {
        marginRight: 20,
    },
    rightAction: {
        marginLeft: 20
    }
})


export function ActionReply({commentKey, depth}) {
    const datastore = useDatastore();
    const comment = useObject('comment', commentKey);
    const parent = useObject('comment', comment.replyTo);
    const personaKey = usePersonaKey();
    
    function onReply() {
        const oldReply = datastore.getSessionData(['replyToComment', commentKey]);
        datastore.setSessionData(['replyToComment', commentKey], !oldReply);
        logEventAsync(datastore, 'reply-start', {commentKey});
    }

    if (comment.from == personaKey) return null;
    if (depth == 1 && parent.from != personaKey) return null;
    if (depth > 1) return null;

    return <SubtleButton icon={IconReply} label='Reply' onPress={needsLogin(onReply, 'reply')} padRight />
}

export function ActionUpvote({commentKey}) {
    const personaKey = usePersonaKey();
    const comment = useObject('comment', commentKey);
    const upvotes = useCollection('upvote', {filter: {comment: commentKey}});
    const datastore = useDatastore();
    const count = upvotes.length;
    const upvoted = upvotes.some(upvote => upvote.from == personaKey);

    function onUpvote() {
        if (upvoted) {
            const myUpvote = upvotes.find(upvote => upvote.from == personaKey);
            datastore.deleteObject('upvote', myUpvote.key);
            logEventAsync(datastore, 'upvote-undo', {commentKey});
        } else {
            datastore.addObject('upvote', {comment: commentKey, from: personaKey});
            logEventAsync(datastore, 'upvote', {commentKey});
        }
    }

    const disabled = comment?.from == personaKey;

    return <SubtleButton icon={upvoted ? IconUpvoted : IconUpvote} bold={upvoted}
        disabled={disabled}
        label={upvoted ? 'Upvoted ({count})' : count ? 'Upvote ({count})' : 'Upvote'} 
        color={upvoted ? colorTextBlue : disabled ? colorDisabledText : colorTextGrey}
        formatParams={{count}} onPress={needsLogin(onUpvote, 'upvote')} />
}



export function ActionEdit({commentKey}) {
    const datastore = useDatastore();
    const personaKey = usePersonaKey();
    const comment = useObject('comment', commentKey)
    function onEdit() {
        if (!comment.replyTo) {
            logEventAsync(datastore, 'edit-start-top', {commentKey});
            pushSubscreen('composer', {commentKey});
        } else {
            logEventAsync(datastore, 'edit-start-reply', {commentKey});
            const old = datastore.getSessionData(['editComment', commentKey]);
            datastore.setSessionData(['editComment', commentKey], !old);
        }
    }

    if (comment.from != personaKey) return null;
    return <SubtleButton icon={IconEdit} label='Edit' onPress={onEdit} padRight />
}

export function ActionReport({commentKey}) {
    const personaKey = usePersonaKey();
    const comment = useObject('comment', commentKey)

    function onReport() {
        logEventAsync(datastore, 'report-start', {commentKey});
        pushSubscreen('report', {commentKey});
    }

    if (comment.from == personaKey) return null;
    return <SubtleButton icon={IconReport} onPress={onReport}/>
}

export function Composer({about=null, commentKey, goBackAfterPost=false, topLevel=false}) {
    const comment = useObject('comment', commentKey);
    const [editedComment, setEditedComment] = useState(null);
    const personaKey = usePersonaKey();
    const datastore = useDatastore();
    const {composerSubtitle} = useConfig();
    const subtitle = composerSubtitle ? composerSubtitle({datastore, comment:(editedComment ?? comment)}) : 'Public Comment';

    function onEditingDone(finalComment) {
        if (commentKey) {
            logEventAsync(datastore, 'edit-finish', {commentKey, text: finalComment.text});
            datastore.updateObject('comment', commentKey, {...finalComment, edited: Date.now()});
        } else {
            logEventAsync(datastore, 'post-finish', {about, text: finalComment.text});
            datastore.addObject('comment', finalComment);
        }
        setEditedComment({text: '', about});
        if (goBackAfterPost) {
            goBack();
        }
    }
    function onCancel() {
        logEventAsync(datastore, commentKey ? 'edit-cancel' : 'post-cancel', {commentKey});
        goBack();
    }

    return <View>
        <Byline type='large' userId={personaKey} subtitleLabel={subtitle} />
        <Pad size={24} />
        <EditComment big comment={editedComment ?? comment ?? {text: ''}} topLevel={topLevel}
            onCancel={goBackAfterPost && onCancel}
            setComment={setEditedComment} onEditingDone={onEditingDone} />
    </View>
 }

export function CommentsIntro() {
    return <View>
        <Heading level={1} label='Comments'/>
        <Pad size={20} />
        <RichText color={colorTextGrey} label='Join the conversation by submitting a comment. Be sure to follow our [community guidelines](https://example.com).' />
    </View>
}

function filterComments({datastore, comments, commentFilters}) {
    if (commentFilters) {
        return comments.filter(comment => 
            commentFilters.every(filter => filter({datastore, comment}))
        )
    } else {
        return comments;
    }
}

export function CommentsInput({about=null}) {
    const {commentInputPlaceholder, commentInputLoginAction} = useConfig();
    return <TextFieldButton placeholder={commentInputPlaceholder} 
                onPress={needsLogin(
                    () => pushSubscreen('composer', {about}), 
                    commentInputLoginAction)} 
    />
}

export function BasicComments({about=null, showInput=true, canPost=true}) {
    const datastore = useDatastore();
    const {noCommentsMessage, noMoreCommentsMessage} = useConfig();
    const {commentInputPlaceholder, commentInputLoginAction, pageTopWidgets, commentFilters} = useConfig();
    const comments = useCollection('comment', {filter: {about, replyTo: null}, sortBy: 'time', reverse: true});
    const filteredComments = filterComments({datastore, comments, commentFilters});
    return <View>
        <View>
        {pageTopWidgets?.map((Widget,i) => 
            <Catcher key={i}><Widget comments={comments} /></Catcher>
        )}
        </View>
        {comments?.length == 0 && 
            <PadBox vert={20} horiz={20}><Banner color={colorTeaserBackground}><RichText label={noCommentsMessage} /></Banner></PadBox>
        }
        <CatchList items={filteredComments} renderItem={comment =>
            <Comment commentKey={comment.key} />
        } />
        {comments?.length > 1 &&
            <PadBox vert={40} horiz={20}><Banner color={colorLightBlueBackground}><RichText label={noMoreCommentsMessage} /></Banner></PadBox>
        }
    </View>
}


export function ComposerScreen({about, commentKey=null, intro=null}) {
    const {composerTopBanners} = useConfig();
    useLogEvent('post-start', {commentKey});
    return <ConversationScreen>
        {composerTopBanners?.map((Banner, i) => <Banner key={i} about={about} />)}
        {intro}
        {/* <Pad size={20} /> */}
        <PadBox horiz={20} top={20}>
            <Composer about={about} commentKey={commentKey} goBackAfterPost topLevel />
        </PadBox>  
    </ConversationScreen>
}
