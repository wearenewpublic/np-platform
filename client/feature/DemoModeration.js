import { Banner, TopBanner } from "../component/banner";
import { IconInfo } from "../component/icon";
import { RichText } from "../component/richtext";
import { UtilityText } from "../component/text";
import { pauseAsync } from "../util/util";

export const DemoModerationFeature = {
    name: 'Demo Moderation',
    key: 'demomoderation',
    config: {
        commentPostCheckers: [checkPostAsync],
        commentEditBottomWidgets: [BadWords],
        topBanners: [DemoBanner],
        composerTopBanners: [DemoBanner]
    }
}

const badwords = 'cat,dog,carrot';

async function checkPostAsync({datastore, comment}) {
    await pauseAsync(1000);
    const badwordList = badwords.split(',');
    for (let word of badwordList) {
        if (comment.text?.toLowerCase()?.includes(word)) {
            return {allow:false, commentProps: {badWord: word}};
        }
    };
    return {allow: true, commentProps: {badWord: null}};
}

function BadWords({comment}) {
    if (!comment.badWord) {
        return null;
    } else {
        return <Banner>
            <RichText label='Your post contains a bad word: **{badWord}**' formatParams={{badWord: comment.badWord}} />
        </Banner>
    }
}

function DemoBanner() {
    return <TopBanner rightIcon={IconInfo}>
        <RichText label='This moderation demo blocks the words **cat**, **dog**, and **carrot**.' />
    </TopBanner>
}