import { useContext } from "react";
import { useObject, usePersonaKey, usePersonaObject } from "../util/datastore";
import { PrototypeContext } from "../organizer/PrototypeContext";
import { getFirebaseUser } from "../util/firebase";
import { Image, StyleSheet, View } from "react-native";
import { IconCircleCheck } from "./icon";
import { UtilityText } from "./text";
import { Pad } from "./basics";
import { formatDate, formatMiniDate } from "./date";
import { colorTextGrey, colorWhite } from "./color";


export function ProfilePhoto({userId, type='large', faint=false, check=false, border=false}) {
    const persona = useObject('persona', userId);


    const {instance} = useContext(PrototypeContext);
    const meKey = usePersonaKey();

    if (meKey == userId && instance.isLive) {
        const fbUser = getFirebaseUser();
        if (fbUser) {
            return <FaceImage photoUrl={fbUser.photoURL} type={type} faint={faint} 
                border={border} check={check} />
        } else {
            return <AnonymousFace faint={faint} type={type} border={border} />
        }
    } else {
        const face = persona?.face;
        return <FaceImage face={face} photoUrl={persona?.photoUrl} type={type} 
            border={border} faint={faint} check={check} />
    }
}

export function FaceImage({face, photoUrl=null, type='small', faint=false, check=false, border=false}) {
    const sizeMap = {
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

export function AnonymousFace({faint, size, border, check}) {
    return <FaceImage face='anonymous.jpeg' faint={faint} size={size} border={border} check={check} />
}

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




export function Byline({type='small', userId, name=null, time, subtitle, underline=false, edited=false}) {
    const s = BylineStyle
    const persona = usePersonaObject(userId);
    if (type == 'large') {
        return <View style={s.outer}>
            <ProfilePhoto userId={userId} type='large' /> 
            <View style={s.right}>
                <UtilityText strong text={name ?? persona?.name} />
                <Pad size={2} />
                <UtilityText color={colorTextGrey} text={subtitle ?? (formatDate(time) + (edited ? ' • edited' : ''))} underline={underline}/>
            </View>
        </View>
    } else {
        return <View style={s.smallOuter}>
            <ProfilePhoto userId={userId} type='small' /> 
            <Pad size={8} />
            <UtilityText strong text={name ?? persona?.name} underline={underline} />
            <Pad size={6} />
            {time && <UtilityText color={colorTextGrey} text={formatMiniDate(time) + (edited ? ' • edited' : '')} />}
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

