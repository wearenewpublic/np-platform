import { useDatastore, useIsLive, useObject, usePersonaKey, usePersonaObject, usePersonaPreview as usePersonaPreview } from "../util/datastore";
import { Image, StyleSheet, Text, View } from "react-native";
import { UtilityText } from "./text";
import { HoverView, Pad, PadBox, spacings } from "./basics";
import { formatDate, formatMiniDate } from "./date";
import { colorBlack, colorDisabledBackground, colorTextGrey, colorWhite, colorPink, colorGreyFormHover } from "./color";
import { TextButton } from "./button";
import { useLanguage } from "./translation";
import { useConfig } from "../util/features";

export function ProfilePhoto({ userId, type = 'large', photo = null, faint = false, border = false}) {
    const persona = useObject('persona', userId);
    const personaPreview = usePersonaPreview();
    const isLive = useIsLive();
    const meKey = usePersonaKey();

    if (meKey == userId && isLive) {
        return <ProfileWithLayers faceComponent={MyProfilePhoto} persona={personaPreview} type={type} photo={photo} faint={faint} border={border} />
    } else {
        const face = persona?.face;
        if (face || photo || persona?.photoUrl) {      
            return <ProfileWithLayers faceComponent={FaceImage} face={face} persona={persona}
                photoUrl={photo ?? persona?.photoUrl} type={type} border={border} faint={faint} />
        } else if (persona?.hue && persona?.name) {
            return <ProfileWithLayers faceComponent={LetterFace} persona={persona} name={persona.name} hue={persona.hue} type={type} />
        } else {
            return <ProfileWithLayers faceComponent={AnonymousFace} persona={persona} faint={faint} type={type} border={border} />
        }
    }
}

export function MyProfilePhoto({type='large', photo=null, faint=false, border=false}) {
    const personaPreview = usePersonaPreview();
    if (personaPreview?.photoUrl) {
        return <ProfileWithLayers faceComponent={FaceImage} persona={personaPreview} photoUrl={photo ?? personaPreview.photoUrl} type={type} faint={faint} border={border} />
    } else if (personaPreview?.hue && personaPreview?.name) {
        return <ProfileWithLayers faceComponent={LetterFace} persona={personaPreview} name={personaPreview.name} hue={personaPreview.hue} type={type} />
    } else {
        return <ProfileWithLayers faceComponent={AnonymousFace} persona={personaPreview} faint={faint} type={type} border={border} />
    }
}

export function ProfileWithLayers({faceComponent: FaceComponent, persona, type='large', ...props}) {
    const {profilePhotoLayers} = useConfig();
    const size = sizeMap[type] ?? 32;
    const badgePad = badgePadMap[type ?? 'small'];
    const badgeSize = badgeSizeMap[type ?? 'small'];
    return <View style={{ position: 'relative', width: size, height: size }}>
        <FaceComponent persona={persona} type={type} {...props} />
        <View style={{position: 'absolute', bottom: 0, right: -badgePad }}>        
            {profilePhotoLayers && persona && profilePhotoLayers.map((LayerComponent,i) => {
                return <LayerComponent key={i} persona={persona} badgeSize={badgeSize} />
            })}
        </View>
    </View>
}

export function FaceImage({ face, photoUrl = null, type = 'small', faint = false, border = false, name = null }) {
    const size = sizeMap[type] ?? 32;

    return <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
        <Image
            style={{
                width: size, height: size, borderRadius: size / 2,
                opacity: faint ? 0.5 : 1,
                borderWidth: border ? 2 : 0,
                borderColor: 'white'
            }}
            source={{ uri: photoUrl ?? ('https://new-public-demo.web.app/faces/' + face) }} />
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

export function AnonymousFace({ faint, type, border }) {
    return <FaceImage face='anonymous2.jpeg' faint={faint} type={type} border={border} />
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
    tag: {
        marginRight: 4,
    }
});

export function Byline({ type = 'small', photoType = null, clickable = true, userId, name = null, photo = null, time, subtitleLabel, subtitleParams = {}, underline = false, edited = false }) {

    const { bylineTags } = useConfig();
    const s = BylineStyle;
    const persona = usePersonaObject(userId);
    const language = useLanguage();
    const datastore = useDatastore();
    const tags = bylineTags?.map(tagFunc => tagFunc(persona)).filter(tag => tag);
    const hasTags = tags?.length > 0;

    function onProfile() {
        datastore.gotoInstance({ structureKey: 'profile', instanceKey: userId });
    }
    const oneLine = hasTags || type == 'small';
    return <View style={s.outer}>
        <ProfilePhoto userId={userId} photo={photo} type={hasTags ? 'large' : photoType ?? type} />
        <Pad size={spacings.xs} />
        <View style={{ flexDirection: 'column' }}>
            <View style={oneLine ? {flexDirection: 'row' } : {flexDirection: 'column'}}>
                {clickable ?
                    <TextButton type='small' strong text={name ?? persona?.name} underline={underline} onPress={onProfile} />
                :
                    <UtilityText strong text={name ?? persona?.name} underline={underline} />
                }
                <Pad size={oneLine ? 8 : 4} />
                {time && <UtilityText color={colorTextGrey}
                    label={'{time}' + (edited ? (' • ' + (oneLine ? 'edited' : 'Edited')) : '')}
                    formatParams={oneLine ? { time: formatMiniDate(time, language) } : { time: formatDate(time, language) } } underline={underline} />
                }
            </View>
            {hasTags && <PadBox top={4}><TagRow tags={tags} /></PadBox>}
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
    tiny: 24,
}

const badgePadMap = {
    huge: 0,
    extraLarge: 2,
    large: 2,
    small: 4,
    tiny: 8,
}

const badgeSizeMap = {
    huge: 24,
    extraLarge: 14,
    large: 14,
    small: 14,
    tiny: 14,
}