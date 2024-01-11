import TestRenderer from 'react-test-renderer'; // ES6
import { InstanceContext } from '../organizer/InstanceContext';
import { StackedScreen, getStructureForKey } from './instance';
import { SharedData } from './shareddata';
import { Datastore } from './datastore';

export async function makeTestInstanceAsync({structureKey, instanceKey = 'demo', screenKey=null, params={}, data={}}) {
    const structure = getStructureForKey(structureKey);
    const instance = {isLive: false, ...data};
    const renderer = await TestRenderer.create(
        <InstanceContext.Provider value={{structureKey, structure, instanceKey, instance, isLive: false}}>
            <SharedData>
                <Datastore 
                    structureKey={structureKey} structure={structure} 
                    instanceKey={instanceKey} instance={instance}
                    isLive={false}>
                    <StackedScreen screenInstance={{structureKey, instanceKey, screenKey, params}} />
                </Datastore>
            </SharedData>
        </InstanceContext.Provider>
    )
    return renderer;
}
