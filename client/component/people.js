import { useDatastore, useIsLive, useObject, usePersonaKey, usePersonaObject, usePersonaPreview as usePersonaPreview } from "../util/datastore";
import { Image, StyleSheet, Text, View } from "react-native";
import { IconCircleCheck } from "./icon";
import { UtilityText } from "./text";
import { HoverView, Pad, PadBox, spacings } from "./basics";
import { formatDate, formatMiniDate } from "./date";
import { colorBlack, colorDisabledBackground, colorTextGrey, colorWhite, colorPink } from "./color";
import { TextButton } from "./button";
import { useLanguage } from "./translation";
import { useConfig } from "../util/features";

export function ProfilePhoto({ userId, type = 'large', photo = null, faint = false, check = false, border = false }) {

    const persona = useObject('persona', userId);
    const isLive = useIsLive();
    const meKey = usePersonaKey();
    const { profilePhotoLayers } = useConfig();

    if (meKey == userId && isLive) {
        return <MyProfilePhoto type={type} photo={photo} faint={faint} check={check} border={border} />
    } else {
        const face = persona?.face;
        if (face || photo || persona?.photoUrl) {
            if (profilePhotoLayers?.length > 0) {                
                return <> 
                    <FaceImage face={face} photoUrl={photo ?? persona?.photoUrl} type={type} border={border} faint={faint} check={check} />
                    {renderLayers(type, persona, profilePhotoLayers)}
                </>
            } else {
                return <FaceImage face={face} photoUrl={photo ?? persona?.photoUrl} type={type} border={border} faint={faint} check={check} />
            }
        } else if (persona?.hue && persona?.name) {
            return <LetterFace name={persona.name} hue={persona.hue} type={type} />
        } else {
            return <AnonymousFace faint={faint} type={type} border={border} />
        }
    }

}

function renderLayers(type, persona, profilePhotoLayers) { 

    const size = sizeMap[type] ?? 32;
    
    return <View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: size,
                height: size,
                backgroundColor: 'transparent'
    }}>
        {profilePhotoLayers && profilePhotoLayers.map((item,i) => item({persona,size,type}))}
    </View>
}

export function MyProfilePhoto({type='large', photo=null, faint=false, check=false, border=false}) {
    const personaPreview = usePersonaPreview();
    if (personaPreview?.photoUrl) {
        return <FaceImage photoUrl={photo ?? personaPreview.photoUrl} type={type} faint={faint} 
            border={border} check={check} />
    } else if (personaPreview?.hue && personaPreview?.name) {
        return <LetterFace name={personaPreview.name} hue={personaPreview.hue} type={type} />
    } else {
        return <AnonymousFace faint={faint} type={type} border={border} />
    }
}

export function FaceImage({ face, photoUrl = null, type = 'small', faint = false, check = false, border = false}) {
    
    const size = sizeMap[type] ?? 32;
    const checkPad = check ? checkPadMap[type ?? 'small'] : 0;

    return <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
        <Image
            style={{
                width: size, height: size, borderRadius: size / 2,
                opacity: faint ? 0.5 : 1, marginRight: checkPad,
                borderWidth: border ? 2 : 0,
                borderColor: 'white'
            }}
            source={{ uri: photoUrl ?? ('https://new-public-demo.web.app/faces/' + face) }} />
        {check && <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
            <IconCircleCheck />
        </View>}
    </View>
}

const fontFamilySansMedium = 'IBMPlexSans_500Medium, Arial, Helvetica, sans-serif';

export function LetterFace({ name, hue, type = 'large' }) {

    const s = LetterFaceStyle;
    const size = sizeMap[type] ?? 32;
    const color = 'hsl(' + hue + ', 96%, 27%)';
    const letter = name.substring(0, 1).toUpperCase();

    return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[{ fontSize: size / 2 }, s.letter]}>{letter}</Text>
    </View>
}

const LetterFaceStyle = StyleSheet.create({
    letter: {
        color: colorWhite,
        fontFamily: fontFamilySansMedium
    }
});

export function AnonymousFace({ faint, type, border, check }) {
    return <FaceImage face='anonymous2.jpeg' faint={faint} type={type} border={border} check={check} />
}

const AnonymousFaceStyle = StyleSheet.create({
    outer: {
        backgroundColor: colorDisabledBackground,
    }
})

export function FacePile({ type = 'small', userIdList }) {

    const s = FacePileStyle;
    const size = sizeMap[type] ?? 32;

    return <View style={s.outer}>
        {userIdList.slice(0, 3).map((userId, i) => <View key={i}
            style={{ position: 'relative', marginLeft: i == 0 ? 0 : -(size / 4) }}>
            <ProfilePhoto userId={userId} type={type} border />
        </View>)}
    </View>
}

const FacePileStyle = StyleSheet.create({
    outer: {
        flexDirection: 'row',
    }
})

function TagRow({tags}) {
    const s = TagRowStyle;
    return <View style={s.outer}>
        {tags.map((tag, i) => <View key={i} style={s.tag}>
            {tag}
        </View>)}
    </View>
}
const TagRowStyle = StyleSheet.create({
    outer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export function BylineMetadata({userId, time, edited=false}) {
    const { bylineTags } = useConfig();
    const language = useLanguage();
    const persona = usePersonaObject(userId);
    const tags = bylineTags?.map(tagFunc => tagFunc(persona)).filter(tag => tag);
    const hasTags = tags?.length > 0;

    // TODO: Support more than one tag when there are designs for that
    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {hasTags && <TagRow tags={[tags[0]]} />}
        {time && <UtilityText type='tiny' color={colorTextGrey}
            label={(hasTags ? ' • ' : '') + '{time}' + (edited ? ' • Edited' : '')}
            formatParams={{time: formatDate(time, language)}}
        />}
    </View>
}

export function Byline({ type = 'small', clickable = true, userId, name = null, photo = null, time, underline = false, edited = false, subtitleLabel, subtitleParams = {}, showMetadata = true }) {
    const s = BylineStyle;
    const persona = usePersonaObject(userId);
    const datastore = useDatastore();

    function onProfile() {
        datastore.gotoInstance({ structureKey: 'profile', instanceKey: userId });
    }
    return <View style={s.outer}>
        <ProfilePhoto userId={userId} photo={photo} type={type} />
        <Pad size={spacings.xs} />
        <View style={{ flexDirection: 'column' }}>
            {clickable ?
                <TextButton type='small' strong text={name ?? persona?.name} underline={underline} onPress={onProfile} />
            :
                <UtilityText weight='medium' text={name ?? persona?.name} underline={underline} />
            }
            {subtitleLabel && <UtilityText color={colorTextGrey} label={subtitleLabel} formatParams={subtitleParams} underline={underline} />}
            {!subtitleLabel && showMetadata && <View>
                <Pad size={2} />
                <BylineMetadata userId={userId} time={time} edited={edited} />
            </View>}
        </View>
    </View>
}


const BylineStyle = StyleSheet.create({
    outer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    right: {
        marginLeft: 8,
    }
})

export function FaceSelect({ selected, onSelect, testID, children }) {
    
    return <FaceButton testID={testID} selected={selected} onPress={!selected && onSelect}>
        {children}
    </FaceButton>
}

export function FaceButton({ selected, onPress, testID, children }) {
    
    const s = FaceButtonStyle;
    
    return <HoverView style={s.ring} onPress={onPress} testID={testID}>
        <View style={selected ? s.blackRing : s.whiteRing}>
            <View style={s.whiteRing}>
                {children}
            </View>
        </View>
    </HoverView>
}

const FaceButtonStyle = StyleSheet.create({
    ring: {
        alignSelf: 'flex-start',
    },
    whiteRing: {
        borderWidth: 3,
        borderColor: colorWhite,
        borderRadius: 50
    },
    blackRing: {
        borderWidth: 3,
        borderColer: colorBlack,
        borderRadius: 50
    },
});

const sizeMap = {
    huge: 80,
    large: 40,
    small: 32,
    tiny: 24
}

const checkPadMap = {
    large: 2,
    small: 4,
    tiny: 8,
}
