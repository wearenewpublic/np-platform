import { ConversationScreen, HorizBox, LoadingScreen, Pad, PadBox } from "../component/basics";
import { Catcher } from "../component/catcher";
import { useServersideConstructor } from "../component/constructor";
import { FaceImage } from "../component/people";
import { Heading } from "../component/text";
import { useInstanceKey } from "../organizer/InstanceContext";
import { useGlobalProperty, usePersonaObject } from "../util/datastore";
import { useConfig } from "../util/features";

export const ProfileStructure = {
    key: 'profile',
    name: 'User Profile',
    screen: ProfileScreen,
    defaultConfig: {
        profileWidgets: []
    }
}

function ProfileScreen() {    
    const userId = useInstanceKey();
    const initialized = useServersideConstructor();
    const userObject = usePersonaObject(userId);
    const userName = userObject?.name;
    const photoUrl = userObject?.photoUrl;
    const {profileWidgets} = useConfig();

    if (!initialized) return <LoadingScreen label='Loading profile...'/>
    if (!userName) return <LoadingScreen label='No such user'/>

    return <ConversationScreen>
        <Pad/>
        <PadBox horiz={20}>
            <HorizBox center>
                <FaceImage type='huge' photoUrl={photoUrl} />  
                <Pad />      
                <Heading level={1} label={userName} />            
            </HorizBox>
            {profileWidgets.map((Widget, i) => <Catcher key={i}><Widget /></Catcher>)}
        </PadBox>
    </ConversationScreen>
}
