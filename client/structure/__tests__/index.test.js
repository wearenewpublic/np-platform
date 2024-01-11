
import React from 'react';
import { InstanceContext } from '../../organizer/InstanceContext';
import { structures } from '..';
import TestRenderer from 'react-test-renderer'; // ES6
import { act } from 'react-dom/test-utils';
import { forEachAsync } from '../../util/util';
import { Datastore } from '../../util/datastore';
import { SharedData } from '../../util/shareddata';

jest.mock('../../util/firebase');

test('All structure instances render correctly', async () => {
    await forEachAsync(structures, async structure => {
        await forEachAsync(structure.instance || [], async instance => {
            // console.log('Rendering ' + structure.name + ' ' + instance.name);
            await renderStructureInstanceAsync({structure, instance});
        });
    });
});

async function renderStructureInstanceAsync({structure, instance}) {
    await act(async () => {
        const renderer = await TestRenderer.create(            
            <InstanceContext.Provider value={{structure, instance, instanceKey: instance.key, isLive: instance.isLive}}>
                <SharedData>
                    <Datastore instance={instance} instanceKey={instance.key} structure={structure} structureKey={structure.key} isLive={instance.isLive}>
                        <structure.screen />
                    </Datastore>
                </SharedData>
            </InstanceContext.Provider>
        );    
        await renderer.unmount();
    })
}

