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

export const CommentContext = React.createContext({
    actions: [ActionReply, ActionUpvote],
    rightActions: [ActionReport, ActionEdit],
    editWidgets: [],
    replyPlaceholder: 'Reply to {authorName}...',
    topLevelPlaceholder: 'Share your thoughts...',
    topLevelAction: 'comment'
})

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
        return <Paragraph text={comment.text.trim()} />
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
    const replyToComment = useObject('comment', comment.replyTo);
    const author = useObject('persona', replyToComment?.from);
    const {replyPlaceholder, topLevelPlaceholder} = useContext(CommentContext);

    const goodLength = checkValidLength({text: comment.text, min, max});
    const canPost = comment.text && !comment.blockPost && goodLength;
    const action = comment.key ? 'Update' : 'Post';
    const placeholder = comment.replyTo ? replyPlaceholder : topLevelPlaceholder;
    
    return <View>
        {topLevel && <TopBarActionProvider label={action} disabled={!canPost} onPress={onEditingDone} />}

        <TextField value={comment.text} onChange={text => setComment({...comment, text})} 
            placeholder={placeholder} autoFocus big={big}
            placeholderParams={{authorName: getFirstName(author?.name)}} />
        <Pad size={12} />
        <CharacterCounter text={comment.text} min={min} max={max} />
        {!personaKey && comment.text && <PadBox top={20}><CTAButton type='primary' label='Sign in to post' onPress={() => pushSubscreen('login')} /></PadBox>}
        {personaKey &&
            <PadBox top={20} >
                <HorizBox center spread>
                    <EditWidgets comment={comment} setComment={setComment} />
                    {!topLevel && 
                        <HorizBox center right>
                            {onCancel && <PadBox right={20}><TextButton color={colorTextGrey} label='Cancel' onPress={onCancel} /></PadBox>}
                            <CTAButton label={action} disabled={!canPost} type='primary' onPress={onEditingDone} />
                        </HorizBox>
                    }
                </HorizBox>                        
            </PadBox>
        }
    </View>
}

function EditWidgets({comment, setComment}) {
    const {editWidgets} = useContext(CommentContext);
    return <HorizBox>
        {editWidgets.map((Widget, idx) => <View key={idx} style={{marginRight: 12}}>
            <Widget comment={comment} setComment={setComment} />
        </View>)} 
    </HorizBox>
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
    const {actions, rightActions} = useContext(CommentContext);
    return <View style={s.actionBar}>
        <View style={s.mainActions}>
            {actions.map((Action, idx) => <Action key={idx} commentKey={commentKey} depth={depth} />)}
        </View>
        <View style={s.rightActions}>
            {rightActions.map((Action, idx) => <Action key={idx} commentKey={commentKey} depth={depth} />)}
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

export function BasicComments({config={}, intro=null, about, canPost=true}) {
    const [sortMode, setSortMode] = useState('time');
    const comments = useCollection('comment', {filter: {about, replyTo: null}, sortBy: 'time', reverse: true});
    const oldConfig = useContext(CommentContext);
    const newConfig = {...oldConfig, ...config};
    return <CommentContext.Provider value={newConfig}>
        {canPost && <Card>
            <PadBox horiz={20}>
                <TextFieldButton placeholder={newConfig.topLevelPlaceholder} 
                    onPress={needsLogin(
                        () => pushSubscreen('composer', {about}), 
                        newConfig.topLevelAction)} 
                />
            </PadBox>
        </Card>}
        <CatchList items={comments} renderItem={comment =>
            <PadBox top={20} horiz={20}><Comment commentKey={comment.key} /></PadBox>
        } />
    </CommentContext.Provider>
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
