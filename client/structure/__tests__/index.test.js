
import React from 'react';
import { PrototypeContext } from '../../organizer/PrototypeContext';
import { prototypes } from '..';
import TestRenderer from 'react-test-renderer'; // ES6
import { act } from 'react-dom/test-utils';
import { forEachAsync } from '../../util/util';
import { Datastore } from '../../util/datastore';
import { SharedData } from '../../util/shareddata';

jest.mock('../../util/firebase');

test('All prototype instances render correctly', async () => {
    await forEachAsync(prototypes, async prototype => {
        await forEachAsync(prototype.instance || [], async instance => {
            // console.log('Rendering ' + prototype.name + ' ' + instance.name);
            await renderPrototypeInstanceAsync({prototype, instance});
        });
    });
});

async function renderPrototypeInstanceAsync({prototype, instance}) {
    await act(async () => {
        const renderer = await TestRenderer.create(            
            <PrototypeContext.Provider value={{prototype, instance, instanceKey: instance.key, isLive: instance.isLive}}>
                <SharedData>
                    <Datastore instance={instance} instanceKey={instance.key} prototype={prototype} prototypeKey={prototype.key} isLive={instance.isLive}>
                        <prototype.screen />
                    </Datastore>
                </SharedData>
            </PrototypeContext.Provider>
        );    
        await renderer.unmount();
    })
}

