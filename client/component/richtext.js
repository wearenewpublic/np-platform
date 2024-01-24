import React from 'react'
import {Text, Platform} from 'react-native'
import * as Linking from 'expo-linking';

import { colorTextBlue, colorBlack } from './color';
import { LinkText, Paragraph } from './text';
import { useTranslation } from './translation';

const urlRegex = /((http:\/\/)|(https:\/\/))?[-a-zA-Z0-9.-]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

const markdownLinkRegex = /\[([^\]]+)\]\(([^\)]+)\)/;

const markdownBoldRegex = /\*\*([^\*]+)\*\*/;

function LinkTextLink({url, children, linkColor}) {
  if (Platform.OS != 'web') {
    return <Text style={{color: linkColor, textDecorationLine: 'underline'}} onPress={()=>Linking.openURL(url)}>{children}</Text>
  } else {
    return <a target='_blank' rel='noreferrer' style={{color: linkColor, textDecoration: 'underline'}} href={url}>{children}</a>
  }
}

function trimUrl(url) {
  if (url.length > 40) {
    return url.slice(0,40)+'...'
  } else {
    return url;
  }
}

function addPrefixToUrl(url) {
  if (!url.startsWith(url,'http')) {
    return 'http://' + url;
  } else {
    return url;
  }
}

function removeTrailingPeriod(url) {
  if (url[url.length - 1] == '.') {
    return url.slice(0,-1);
  } else {
    return url;
  }
}

function RichTextPart({text, color, type='small', linkColor}) {
    if (!text) return null;
    const mMarkdown = text.match(markdownLinkRegex);
    if (mMarkdown && mMarkdown.length > 0) {
        const mdLink = mMarkdown[0];
        const title = mMarkdown[1];
        const url = mMarkdown[2];
        const start = text.indexOf(mdLink);
        const before = text.slice(0,start);
        const after = text.slice(start + mdLink.length);
        return (
            <Text>
                <Paragraph color={color} type={type} text={before} />
                <LinkText type={type} url={url} text={title} />
                <RichTextPart color={color} type={type} text={after} />
            </Text>
        )
    }
    const mUrl = text.match(urlRegex);
    if (mUrl && mUrl.length > 0) {
        const url = mUrl[0];
        const linkUrl = removeTrailingPeriod(addPrefixToUrl(url));
        const start = text.indexOf(url);
        const before = text.slice(0,start);
        const after = text.slice(start + url.length);
        return (
        <Text>
            <Paragraph color={color} type={type} text={before} />
            <LinkText type={type} url={linkUrl} text={trimUrl(url)} />
            <RichTextPart color={color} type={type} text={after} />
        </Text>
        )
    } 
    const mBold = text.match(markdownBoldRegex);
    if (mBold && mBold.length > 0) {
        const boldText = mBold[1];
        const start = text.indexOf(mBold[0]);
        const before = text.slice(0,start);
        const after = text.slice(start + mBold[0].length);
        return (
            <Text>
                <Paragraph color={color} type={type} text={before} />
                <Paragraph color={color} type={type} text={boldText} strong />
                <RichTextPart color={color} type={type} text={after} />
            </Text>
        )
    }
    return <Paragraph color={color} type={type} text={text} />
}

export function RichText({text, type, color={colorBlack}, label, formatParams}) {
    const tText = useTranslation(label, formatParams);
    return <RichTextPart color={color} type={type} text={text ?? tText} />
}