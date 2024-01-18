import React, { useContext, useState } from "react";
import { useCollection, useDatastore, useObject, usePersona, usePersonaKey, useSessionData } from "../util/datastore"
import { Byline, FacePile, Persona } from "./people"
import { Card, ConversationScreen, Divider, PadBox, Pad, HorizBox } from "./basics";
import { CharacterCounter, Heading, Paragraph, TextField, TextFieldButton, checkValidLength } from "./text";
import { CTAButton, ExpandButton, IconButton, SubtleButton, TextButton } from "./button";
import { IconEdit, IconReply, IconReport, IconUpvote, IconUpvoted } from "./icon";
import { goBack, pushSubscreen } from "../util/navigate";
import { StyleSheet, Text, View } from "react-native";
import { getFirstName } from "../util/util";
import { colorDisabledText, colorTextBlue, colorTextGrey } from "./color";
import { RichText } from "./richtext";
import { CatchList } from "./catcher";
import { TopBarActionProvider } from "../organizer/TopBar";
import { needsLogin } from "../organizer/Login";
import { useConfig } from "../util/features";


export function Comment({commentKey}) {
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    return <Card>
        <Byline type='large' userId={comment.from} time={comment.time} edited={comment.edited} />
        <Pad size={20} />
        <CommentBody commentKey={commentKey} />
        {!editing && <PadBox top={20}><CommentActions commentKey={commentKey} /></PadBox>}
        <MaybeCommentReply commentKey={commentKey} />
        <CommentReplies commentKey={commentKey} />
    </Card>
}

export function ReplyComment({commentKey, depth={depth}}) {
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    return <View>
        <Pad size={20} />
        <Divider />
        <Pad size={20} />
        <Byline type='small' userId={comment.from} time={comment.time} edited={comment.edited} />
        <Pad size={20} />
        <View style={{marginLeft: 40}}>
            <CommentBody commentKey={commentKey} />
            <Pad size={20} />
            {!editing && <CommentActions commentKey={commentKey} depth={depth} />}
            <MaybeCommentReply commentKey={commentKey} />
            <CommentReplies commentKey={commentKey} depth={depth+1} />
        </View>
    </View>    
}

function CommentBody({commentKey}) {
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    const [editedComment, setEditedComment] = useState(null);
    const datastore = useDatastore();
    const {commentTopWidgets} = useConfig();

    function onEditingDone() {
        setEditedComment(null);
        datastore.updateObject('comment', comment.key, {...editedComment, edited: Date.now()});
        datastore.setSessionData(['editComment', comment.key], false);
    }

    function onCancel() {
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
            <Paragraph text={comment.text.trim()} />
        </View>
    }
}

function MaybeCommentReply({commentKey}) {
    const replyEnabled = useSessionData(['replyToComment', commentKey]);
    const personaKey = usePersonaKey();
    const [comment, setComment] = useState({text: '', replyTo: commentKey});
    const datastore = useDatastore();
    if (!replyEnabled) return null;

    function onEditingDone() {
        datastore.setSessionData(['replyToComment', comment.replyTo], false);
        datastore.setSessionData(['showReplies', comment.replyTo], true);
        datastore.addObject('comment', comment);
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
        <EditComment comment={comment} onCancel={onCancel}
            setComment={setComment} onEditingDone={onEditingDone} />
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
        commentEditBottomWidgets, commentEditTopWidgets
        } = useConfig();

    const isBlocked = commentPostBlockers.some(blocker => blocker({comment}));
    const canPost = comment.text && !isBlocked;
    const action = comment.key ? 
          (inProgress ? 'Updating...' : 'Update') 
        : (inProgress ? 'Posting...' : 'Post');
    const placeholder = comment.replyTo ? commentReplyPlaceholder : commentInputPlaceholder;
    
    async function onPost() {
        if (commentPostCheckers?.length) {
            setInProgress(true);
            const checkResults = await Promise.all(commentPostCheckers.map(checker =>
                checker({datastore, comment, setComment})
            ))
            if (!checkResults.some(x => x)) {
                onEditingDone();
            }
            setInProgress(false);
        } else {
            onEditingDone();
        }
    }

    return <View>
        {topLevel && <TopBarActionProvider label={action} disabled={!canPost || inProgress} onPress={onPost} />}
        <EditWidgets widgets={commentEditTopWidgets} comment={comment} setComment={setComment} />
        <TextField value={comment.text} onChange={text => setComment({...comment, text})} 
            placeholder={placeholder} autoFocus big={big}
            placeholderParams={{authorName: getFirstName(author?.name)}} />
        <Pad size={12} />
        <EditWidgets widgets={commentEditBottomWidgets} comment={comment} setComment={setComment} />
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

function EditWidgets({widgets, comment, setComment}) {
    return <View>
        {widgets?.map((Widget, idx) => <View key={idx} style={{marginRight: 12}}>
            <Widget comment={comment} setComment={setComment} />
        </View>)} 
    </View>
}

function CommentReplies({commentKey, depth=1}) {
    const replies = useCollection('comment', {filter: {replyTo: commentKey}, sortBy: 'time', reverse: true});
    const replyUsers = replies.map(reply => reply.from);
    const expanded = useSessionData(['showReplies', commentKey]);
    const datastore = useDatastore();

    function setExpanded(expanded) {
        datastore.setSessionData(['showReplies', commentKey], expanded);
    }

    if (replies.length == 0) return null;
    
    return <View>
        <Pad size={20} />
        <ExpandButton userList={replyUsers} label='{count} {noun}' 
            expanded={expanded} setExpanded={setExpanded}
            formatParams={{count: replies.length, singular: 'reply', plural: 'replies'}} />
        {/* {expanded && replies.map(reply => <ReplyComment key={reply.key} commentKey={reply.key} />)} */}
        {expanded && <CatchList items={replies} renderItem={reply =>
            <ReplyComment commentKey={reply.key} depth={depth} />
        } />}
    </View>
}


function CommentActions({commentKey, depth}) {
    const s = CommentActionsStyle;
    const {commentActions, commentRightActions} = useConfig();
    return <View style={s.actionBar}>
        <View style={s.mainActions}>
            {commentActions.map((Action, idx) => <Action key={idx} commentKey={commentKey} depth={depth} />)}
        </View>
        <View style={s.rightActions}>
            {commentRightActions.map((Action, idx) => <Action key={idx} commentKey={commentKey} depth={depth} />)}
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

    function onReply() {
        const oldReply = datastore.getSessionData(['replyToComment', commentKey]);
        datastore.setSessionData(['replyToComment', commentKey], !oldReply);
    }

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
        } else {
            datastore.addObject('upvote', {comment: commentKey, from: personaKey});
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
        const old = datastore.getSessionData(['editComment', commentKey]);
        datastore.setSessionData(['editComment', commentKey], !old);
    }

    if (comment.from != personaKey) return null;
    return <SubtleButton icon={IconEdit} label='Edit' onPress={onEdit} padRight />
}

export function ActionReport({commentKey}) {
    const personaKey = usePersonaKey();
    const comment = useObject('comment', commentKey)

    function onReport() {
        pushSubscreen('report', {commentKey});
    }

    if (comment.from == personaKey) return null;
    return <SubtleButton icon={IconReport} onPress={onReport}/>
}

export function Composer({about=null, goBackAfterPost=false, topLevel=false, contentType}) {
    const [comment, setComment] = useState({text: '', about});
    const personaKey = usePersonaKey();
    const datastore = useDatastore();
    function onEditingDone() {
        datastore.addObject('comment', comment);
        console.log('added comment', comment);
        setComment({text: '', about});
        if (goBackAfterPost) {
            goBack();
        }
    }
    function onCancel() {
        goBack();
    }

    return <View>
        <Byline type='large' userId={personaKey} subtitle={contentType} />
        <Pad size={24} />
        <EditComment big comment={comment} topLevel={topLevel}
            onCancel={goBackAfterPost && onCancel}
            setComment={setComment} onEditingDone={onEditingDone} />
    </View>
 }

export function CommentsIntro() {
    return <PadBox horiz={20}>
        <Heading level={1} label='Comments'/>
        <Pad size={20} />
        <RichText color={colorTextGrey} label='Join the conversation by submitting a comment. Be sure to follow our [community guidelines](https://example.com).' />
    </PadBox>
}

function filterComments({datastore, comments, commentFilters}) {
    return comments.filter(comment => 
        commentFilters.every(filter => filter({datastore, comment}))
    )
}

export function BasicComments({config={}, intro=null, about, canPost=true}) {
    const datastore = useDatastore();
    const {commentInputPlaceholder, commentInputLoginAction, pageTopWidgets, commentFilters} = useConfig();
    const comments = useCollection('comment', {filter: {about, replyTo: null}, sortBy: 'time', reverse: true});
    const filteredComments = filterComments({datastore, comments, commentFilters});
    return <View>
        {canPost && <Card>
            <PadBox horiz={20}>
                <TextFieldButton placeholder={commentInputPlaceholder} 
                    onPress={needsLogin(
                        () => pushSubscreen('composer', {about}), 
                        commentInputLoginAction)} 
                />
            </PadBox>
        </Card>}
        <View>
        {pageTopWidgets.map((Widget,i) => 
            <Widget key={i} comments={comments} />
        )}
        </View>
        <CatchList items={filteredComments} renderItem={comment =>
            <PadBox top={20} horiz={20}><Comment commentKey={comment.key} /></PadBox>
        } />
    </View>
}


export function ComposerScreen({about, intro=null, contentType}) {
    return <ConversationScreen>
        {intro}
        {/* <Pad size={20} /> */}
        <PadBox horiz={20}>
            <Composer about={about} goBackAfterPost topLevel contentType={contentType} />
        </PadBox>  
    </ConversationScreen>
}
