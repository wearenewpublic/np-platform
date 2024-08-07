import { useIsLive, useObject, usePersonaKey, usePersonaObject } from "../util/datastore";
import { getFirebaseUser } from "../util/firebase";
import { Image, StyleSheet, View } from "react-native";
import { IconCircleCheck } from "./icon";
import { UtilityText } from "./text";
import { Pad } from "./basics";
import { formatDate, formatMiniDate } from "./date";
import { colorDisabledBackground, colorTextGrey } from "./color";
import { TextButton } from "./button";
import { gotoInstance } from "../util/navigate";
import { useLanguage } from "./translation";


export function ProfilePhoto({userId, type='large', photo=null, faint=false, check=false, border=false}) {
    const persona = useObject('persona', userId);
    const isLive = useIsLive();
    const meKey = usePersonaKey();

    if (meKey == userId && isLive) {
        const fbUser = getFirebaseUser();
        if (fbUser) {
            return <FaceImage photoUrl={photo ?? fbUser.photoURL} type={type} faint={faint} 
                border={border} check={check} />
        } else {
            return <AnonymousFace faint={faint} type={type} border={border} />
        }
    } else {
        const face = persona?.face;
        if (face || photo || persona?.photoUrl) {
            return <FaceImage face={face} photoUrl={photo ?? persona?.photoUrl} type={type} 
                border={border} faint={faint} check={check} />
        } else {
            return <AnonymousFace faint={faint} type={type} border={border} />    
        }
    }
}

export function FaceImage({face, photoUrl=null, type='small', faint=false, check=false, border=false}) {
    const sizeMap = {
        huge: 80,
        large: 40,
        small: 32,
        tiny: 24,
    }
    const size = sizeMap[type] ?? 32;

    const checkPadMap = {
        large: 2,
        small: 4,
        tiny: 8,
    }
    const checkPad = check ? checkPadMap[type ?? 'small'] : 0;


    return <View style={{position: 'relative', alignSelf: 'flex-start'}}>
        <Image 
            style ={{
                width: size, height: size, borderRadius: size /2, 
                opacity: faint ? 0.5 : 1, marginRight: checkPad,
                borderWidth: border ? 2 : 0,
                borderColor: 'white'
                // border: border ? '2px solid white' : null
            }}
            source={{uri: photoUrl ?? ('https://new-public-demo.web.app/faces/' + face)}} />
    
            {check && <View style={{position: 'absolute', right: 0, bottom: 0}}>
                <IconCircleCheck />
            </View>
        }
    </View>
}

export function AnonymousFace({faint, type, border, check}) {
    return <FaceImage face='anonymous2.jpeg' faint={faint} type={type} border={border} check={check} />
}

const AnonymousFaceStyle = StyleSheet.create({
    outer: {
        backgroundColor: colorDisabledBackground,
    }
})

export function FacePile({type='small', userIdList}) {
    const s = FacePileStyle;
    const sizeMap = {
        small: 32,
        tiny: 24,
    }
    const size = sizeMap[type] ?? 32;
 
    return <View style={s.outer}>
        {userIdList.slice(0,3).map((userId, i) => <View key={i} 
                style={{position: 'relative', marginLeft: i == 0 ? 0 : -(size/4)}}>
            <ProfilePhoto userId={userId} type={type} border />
        </View>)}
    </View>
}
const FacePileStyle = StyleSheet.create({
    outer: {
        flexDirection: 'row',
    }
})




export function Byline({type='small', photoType=null, clickable=true, userId, name=null, photo=null, time, subtitleLabel, subtitleParams={}, underline=false, edited=false}) {
    const s = BylineStyle
    const persona = usePersonaObject(userId);
    const language = useLanguage();
    function onProfile() {
        gotoInstance({structureKey: 'profile', instanceKey: userId});
    }
    if (type == 'large') {
        return <View style={s.outer}>
            <ProfilePhoto userId={userId} photo={photo} type={photoType ?? 'large'} /> 
            <View style={s.right}>
                {/* <UtilityText strong text={name ?? persona?.name} /> */}
                <TextButton type='small' alignStart text={name ?? persona?.name} strong onPress={onProfile} />
                <Pad size={2} />
                {subtitleLabel ? 
                    <UtilityText color={colorTextGrey} label={subtitleLabel} formatParams={subtitleParams} underline={underline} />
                : 
                    <UtilityText color={colorTextGrey} 
                        label={'{time}' + (edited ? ' • Edited' : '')} 
                        formatParams={{time: formatDate(time, language)}} underline={underline}/>
                }
            </View>
        </View>
    } else {
        return <View style={s.smallOuter}>
            <ProfilePhoto userId={userId} photo={photo} type={photoType ?? 'small'} /> 
            <Pad size={8} />
            {clickable ?
                <TextButton type='small' strong text={name ?? persona?.name} underline={underline} onPress={onProfile} />
            : 
                <UtilityText strong text={name ?? persona?.name} underline={underline} />
            }
            {time && <Pad size={6} />}
            {time && <UtilityText color={colorTextGrey} 
                        label={'{time}' + (edited ? ' • Edited' : '')} 
                        formatParams={{time: formatMiniDate(time, language)}} underline={underline}/>
            }
        </View>
    }
}

const BylineStyle = StyleSheet.create({
    outer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    right: {
        marginLeft: 8,
    },
    smallOuter: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

