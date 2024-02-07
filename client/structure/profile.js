import { ConversationScreen, HorizBox, Pad } from "../component/basics";
import { Catcher } from "../component/catcher";
import { FaceImage } from "../component/people";
import { Heading } from "../component/text";
import { useInstanceKey } from "../organizer/InstanceContext";
import { useGlobalProperty } from "../util/datastore";
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
    const userName = useGlobalProperty('name');
    const photoUrl = useGlobalProperty('photoUrl');
    const {profileWidgets} = useConfig();
    console.log('ProfileScreen', {userName, photoUrl});

    return <ConversationScreen>
        <Pad/>
        <HorizBox center>
            <FaceImage type='huge' photoUrl={photoUrl} />  
            <Pad />      
            <Heading level={1} label={userName} />            
        </HorizBox>
        <Pad/>
        {profileWidgets.map((Widget, i) => <Catcher key={i}><Widget /></Catcher>)}
    </ConversationScreen>
}
