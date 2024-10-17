import { View } from 'react-native';
import {useInstanceParams} from '../util/params';
import { Heading, UtilityText } from '../component/text';
import { ConversationScreen, Pad } from '../component/basics';

export const ErrorStructure = {
    name: 'Error',
    key: 'error',
    screen: ErrorScreen,
}

export function ErrorScreen() {
    const {errorMessage, errorTitle} = useInstanceParams();
    return <ConversationScreen pad>
        <Pad />
        <Heading level={1} label={errorTitle ?? 'Error'} />
        <Pad size={8} />
        {errorMessage && <UtilityText size='large' label={errorMessage}/>}
    </ConversationScreen>
}
