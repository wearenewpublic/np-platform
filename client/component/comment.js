import React, { useState } from "react";
import { useCollection, useDatastore, useObject, usePersonaKey, useSessionData } from "../util/datastore";
import { Byline } from "./people";
import { ConversationScreen, PadBox, Pad, HorizBox, Separator, ShadowBox } from "./basics";
import { Heading, TextField, TextFieldButton } from "./text";
import { CTAButton, ExpandButton, SubtleButton, TextButton } from "./button";
import { Reply, Edit, Flag } from "@carbon/icons-react";
import { StyleSheet, View } from "react-native";
import { getFirstName } from "../util/util";
import { colorLightBlueBackground, colorTextGrey } from "./color";
import { RichText } from "./richtext";
import { CatchList, Catcher } from "./catcher";
import { TopBarActionProvider } from "../organizer/TopBar";
import { needsLogin } from "../organizer/Login";
import { useConfig } from "../util/features";
import { Banner } from "./banner";
import { logEventAsync, useLogEvent } from "../util/eventlog";
import { NoCommentsHelp } from "./help";
import { useIsAdmin } from "./admin";
import { getIsMobileWeb } from '../platform-specific/deviceinfo'


export function Comment({commentKey}) {
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    const {commentAboveWidgets, commentBelowWidgets, commentBodyRenderer} = useConfig();
    return <View testID={commentKey} id={commentKey}>
        <PadBox top={20} horiz={20}>
            <Catcher>
                {commentAboveWidgets?.map((Widget,i) => <Widget key={i} comment={comment}/>)}
            </Catcher>
            <Byline type='large' userId={comment.from} time={comment.time} edited={comment.edited} />
            <Pad size={20} />
            <PadBox left={48}>
                <Catcher>
                    {commentBodyRenderer ?
                        React.createElement(commentBodyRenderer, {comment, commentKey})
                    : 
                        <CommentBody commentKey={commentKey} />
                    }
                </Catcher>
                <Catcher>
                    {commentBelowWidgets?.map((Widget,i) => <Widget key={i} comment={comment}/>)}
                </Catcher>
                {!editing && <PadBox top={20}><Catcher><CommentActions commentKey={commentKey} /></Catcher></PadBox>}
                <MaybeCommentReply commentKey={commentKey} />
                <CommentReplies commentKey={commentKey} />
            </PadBox>
        </PadBox>
        <PadBox horiz={20}><Separator /></PadBox>
    </View>
}

export function ReplyComment({commentKey, depth={depth}, isFinal=false}) {
    const s = ReplyCommentStyle;
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    const {replyAboveWidgets} = useConfig();
    return <View testID={commentKey} style={depth == 1 ? s.firstLevel : s.secondLevel}>
        <Catcher>{replyAboveWidgets?.map((Widget,i) => <Widget key={i} comment={comment}/>)}</Catcher>
        <Byline type='small' userId={comment.from} time={comment.time} edited={comment.edited} />
        <Pad size={20} />
        <PadBox left={40}>
            <CommentBody commentKey={commentKey} />
            <Pad size={20} />
            {!editing && <Catcher><CommentActions commentKey={commentKey} depth={depth} /></Catcher>}
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


export function CommentBody({commentKey}) {
    const comment = useObject('comment', commentKey);
    const editing = useSessionData(['editComment', commentKey]);
    const [editedComment, setEditedComment] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const datastore = useDatastore();
    const {commentTopWidgets} = useConfig();
    const text = comment.text || '';
    const isLong = guessNumberOfLines(text) > 8;
    
    function onEditingDone(finalComment) {
        setEditedComment(null);
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
            <RichText numberOfLines={(isLong && !expanded) ? 8 : null} 
                text={text.trim()} 
            />
            {isLong && !expanded && <PadBox top={14}><TextButton underline type='small' label='Read more' onPress={() => setExpanded(true)} /></PadBox>}
        </View>
    }
}

function guessNumberOfLines(text) {
    const lines = text.split('\n');
    const linesPerLine = lines.map(line => Math.floor(line.length / 60) + 1);
    const sum = linesPerLine.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum;
}

function MaybeCommentReply({commentKey}) {
    const replyEnabled = useSessionData(['replyToComment', commentKey]);
    const personaKey = usePersonaKey();
    const [comment, setComment] = useState({text: '', replyTo: commentKey});
    const datastore = useDatastore();
    if (!replyEnabled) return null;

    function onEditingDone(finalComment) {
        datastore.setSessionData(['replyToComment', comment.replyTo], false);
        datastore.setSessionData(['showReplies', comment.replyTo], true);
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
        commentPostTriggers,
        commentEditBottomWidgets, commentEditTopWidgets,
        commentAllowEmpty
        } = useConfig();

    const isBlocked = commentPostBlockers?.some(blocker => blocker({datastore, comment}));
    const canPost = (comment.text || commentAllowEmpty) && !isBlocked;
    const action = comment.key ? 
          (inProgress ? 'Updating...' : 'Update') 
        : (inProgress ? 'Posting...' : 'Post');
    const placeholder = comment.replyTo ? commentReplyPlaceholder : commentInputPlaceholder;
    
    async function storeCommentAndRunTriggers(comment) {
        var commentKey = comment.key;
        if (comment.key) {
            logEventAsync(datastore, 'edit-finish', {commentKey, text: comment.text});
            await datastore.updateObject('comment', comment.key, {...comment, edited: Date.now()});
        } else {
            commentKey = await datastore.addObject('comment', comment);
            if (comment.replyTo) {
                logEventAsync(datastore, 'reply-finish', {commentKey, text: comment.text});
            } else {
                logEventAsync(datastore, 'post-finish', {commentKey, text: comment.text});
            }
        }
        if (commentPostTriggers?.length) {
            // Don't await the promise, since some triggers may be slow
            Promise.all(commentPostTriggers.map(trigger => trigger({datastore, comment, commentKey})));
        }
    }

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
            if (checkResults.every(x => x.allow)) {
                await storeCommentAndRunTriggers(finalComment);
                onEditingDone(finalComment);
            } else {
                setComment(finalComment);
            }
            setInProgress(false);
        } else {
            await storeCommentAndRunTriggers(comment);
            onEditingDone(comment);
        }
    }
    const isMobile = getIsMobileWeb();
    const [isFocused, setIsFocused] = useState(false);

    return <View>
        {topLevel && <TopBarActionProvider label={action} disabled={!canPost || inProgress} onPress={onPost} />}
        <EditWidgets widgets={commentEditTopWidgets} comment={comment} setComment={setComment} onCancel={onCancel} />
        {big && <EditWidgets widgets={commentEditBottomWidgets} comment={comment} setComment={setComment} onCancel={onCancel} />}
        <TextField value={comment.text} onChange={text => setComment({...comment, text})} 
            placeholder={placeholder} autoFocus={!isMobile} big={big} testID='comment-edit'
            placeholderParams={{authorName: getFirstName(author?.name)}} 
            onFocusChange={setIsFocused}/>
            {(isFocused || comment.text?.length > 0) && isMobile && (
                <PadBox top={24} >
                    <View>
                        <CTAButton wide label={action} disabled={!canPost || inProgress} onPress={onPost} />
                    </View>
                </PadBox>
            )}
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
    const {replyFilters, replyBoosters, commentRankers} = useConfig();
    const datastore = useDatastore();
    const isAdmin = useIsAdmin();
    var replies = useCollection('comment', {filter: {replyTo: commentKey}, sortBy: 'time', reverse: true});
    replies = filterComments({datastore, comments: replies, isAdmin, commentFilters: replyFilters});
    replies = rankComments({datastore, comments: replies, commentRankers: commentRankers});
    const boostedComment = replyBoosters?.map(booster => booster({comments: replies}))[0];
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
        {boostedComment && !expanded && <PadBox top={20}><ShadowBox>
            <PadBox horiz={20}>
                <ReplyComment isFinal commentKey={boostedComment.key} depth={depth} />
            </PadBox>
        </ShadowBox></PadBox>}
        <Pad />
            <ExpandButton userList={replyUsers} label='{count} {noun}' 
                expanded={expanded} setExpanded={setExpanded} testID='toggle-replies'
                formatParams={{count: replies.length, singular: 'reply', plural: 'replies'}} />
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

    return <SubtleButton icon={Reply} label='Reply' onPress={needsLogin(onReply, 'reply')} padRight />
}

export function ActionEdit({commentKey}) {
    const datastore = useDatastore();
    const personaKey = usePersonaKey();
    const comment = useObject('comment', commentKey)
    function onEdit() {
        if (!comment.replyTo) {
            logEventAsync(datastore, 'edit-start-top', {commentKey});
            datastore.pushSubscreen('composer', {commentKey});
        } else {
            logEventAsync(datastore, 'edit-start-reply', {commentKey});
            const old = datastore.getSessionData(['editComment', commentKey]);
            datastore.setSessionData(['editComment', commentKey], !old);
        }
    }

    if (comment.from != personaKey) return null;
    return <SubtleButton icon={Edit} label='Edit' onPress={onEdit} />
}

export function ActionReport({commentKey}) {
    const personaKey = usePersonaKey();
    const comment = useObject('comment', commentKey);
    const datastore = useDatastore();

    function onReport() {
        logEventAsync(datastore, 'report-start', {commentKey});
        datastore.pushSubscreen('report', {commentKey});
    }

    if (comment.from == personaKey) return null;
    return <SubtleButton icon={Flag} onPress={onReport}/>
}

export function Composer({about=null, commentKey, goBackAfterPost=false, topLevel=false}) {
    const comment = useObject('comment', commentKey);
    const [editedComment, setEditedComment] = useState(null);
    const personaKey = usePersonaKey();
    const datastore = useDatastore();
    const {composerSubtitle, composerTopWidgets} = useConfig();
    const subtitle = composerSubtitle ? composerSubtitle({datastore, comment:(editedComment ?? comment)}) : 'Public Comment';

    function onEditingDone(finalComment) {
        setEditedComment({text: '', about});
        if (goBackAfterPost) {
            datastore.goBack();
        }
    }
    function onCancel() {
        logEventAsync(datastore, commentKey ? 'edit-cancel' : 'post-cancel', {commentKey});
        datastore.goBack();
    }

    return <View>
        <EditWidgets widgets={composerTopWidgets} 
            comment={editedComment ?? comment ?? {text: ''}} 
            setComment={setEditedComment} 
            onCancel={goBackAfterPost && onCancel} />
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

function filterComments({datastore, comments, isAdmin, commentFilters}) {
    if (commentFilters) {
        return comments.filter(comment => 
            commentFilters.every(filter => filter({datastore, isAdmin, comment}))
        )
    } else {
        return comments;
    }
}

export function CommentsInput({about=null}) {
    const {commentInputPlaceholder, commentInputLoginAction} = useConfig();
    const datastore = useDatastore();
    return <TextFieldButton placeholder={commentInputPlaceholder} 
                onPress={needsLogin(
                    () => datastore.pushSubscreen('composer', {about}), 
                    commentInputLoginAction)} 
    />
}

function rankComments({datastore, comments, commentRankers, chosenRanker}) {
    var ranker;
    if (chosenRanker) {
        ranker = commentRankers.find(ranker => ranker.name == chosenRanker);
    } else {
        ranker = commentRankers?.[0];
    }
    if (ranker) {
        return ranker.ranker({datastore, comments});
    } else {
        return comments;
    }
}

export function BasicComments({about=null, showInput=true, canPost=true}) {
    const datastore = useDatastore();
    const {noMoreCommentsMessage, commentRankers, pageTopWidgets, pageShowEmptyHelp,
        pageBottomWidgets, commentFilters} = useConfig();
    const comments = useCollection('comment', {filter: {about, replyTo: null}, sortBy: 'time', reverse: true});
    const isAdmin = useIsAdmin();
    const filteredComments = filterComments({datastore, comments, isAdmin, commentFilters});
    const rankedComments = rankComments({datastore, comments: filteredComments, commentRankers});
    return <View>
        <View>
            {pageTopWidgets?.map((Widget,i) => 
                <Catcher key={i}><Widget comments={comments} /></Catcher>
            )}
        </View>
        {comments?.length == 0 && pageShowEmptyHelp &&
            <NoCommentsHelp />
        }
        <CatchList items={rankedComments} renderItem={comment =>
            <Comment commentKey={comment.key} />
        } />
        {comments?.length > 0 && !pageBottomWidgets?.length > 0 &&
            <PadBox vert={40} horiz={20}><Banner color={colorLightBlueBackground}><RichText label={noMoreCommentsMessage} /></Banner></PadBox>
        }
        <View>
            {pageBottomWidgets?.map((Widget,i) => 
                <Catcher key={i}><Widget comments={comments} /></Catcher>
            )}
        </View>
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