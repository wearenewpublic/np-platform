import React, { useState } from 'react';
import { act, render } from '@testing-library/react';
import { assembleConfig, flattenFeatureBlocks } from './features';
import { Datastore } from './datastore';
import { testStoryActionListAsync } from './testutil';
import { defaultServerCall, NavResult, ServerCallLog } from '../system/demo';
import { getStructureForKey } from './instance';
import { keysToTrueMap } from './util';
import { default_fbUser } from './testpersonas';

export function runComponentDemoTestsForDemoFeatures(features) {
    const componentDemoFeatures = flattenFeatureBlocks(features['componentdemo']);

    runComponentTests(componentDemoFeatures);
    runFeatureTests(componentDemoFeatures);
    runStructureTests(componentDemoFeatures);
}

function findComponentPages(componentDemoFeatures) {
    var componentPages = [];
    componentDemoFeatures.forEach(feature => {
        feature.config.componentSections?.forEach(section => {
            section.pages.forEach(page => {
                componentPages.push(page);
            });
        });
    });
    return componentPages;
}

function findStructurePages(componentDemoFeatures) {
    var structurePages = [];
    componentDemoFeatures.forEach(feature => {
        feature.config.structureSections?.forEach(section => {
            section.pages.forEach(page => {
                structurePages.push(page);
            });
        });
    });
    return structurePages;
}

function findFeaturePages(componentDemoFeatures) {
    var featurePages = [];
    componentDemoFeatures.forEach(feature => {
        feature.config.featureSections?.forEach(section => {
            section.pages.forEach(page => {
                featurePages.push(page);
            });
        });
    });
    return featurePages;
}

function runComponentTests(componentDemoFeatures) {
    const componentPages = findComponentPages(componentDemoFeatures);

    describe.each(componentPages)('Component: $label', page => {
        if (page.screen) {
            test('Render', async () => {
                const rendered = await act(async () => 
                    render(<Datastore>{React.createElement(page.screen)}</Datastore>)
                );
                expect(rendered).toMatchSnapshot();
            });
        } 
        if (!page.storySets) return;
        describe.each(page.storySets())('Story: $label', storySet => {
            test('Start', async () => {
                const rendered = await act(async () => 
                    render(<StorySetContent storySet={storySet} />)
                );
                expect(rendered).toMatchSnapshot();            
             });
            if (!storySet.stories || storySet.stories.length == 0) return;
            test.each(storySet.stories || [])('Action: $label', async story => {
                const rendered = await act(async () => 
                    render(<StorySetContent storySet={storySet} />)
                );
                await testStoryActionListAsync(story.actions);
                expect(rendered).toMatchSnapshot();            
            });
        });
    });
}

function StorySetContent({storySet}) {    
    const [navInstance, setNavInstance] = useState(null);
    const [callLog, setCallLog] = useState([]);
    function onServerCall(call) {
        setCallLog(oldLog => [...oldLog, call]);
    }

    var featureConfig;
    if (storySet.features) {
        const structure = getStructureForKey(storySet.structureKey);
        featureConfig = assembleConfig({
            structure, activeFeatures: keysToTrueMap(storySet.features), 
            includeDefaults: false
        });
    }

    return <Datastore config={featureConfig ?? storySet.config} collections={storySet.collections}
        instanceKey={storySet.instanceKey ?? 'testInstance'} 
        siloKey={storySet.siloKey ?? 'demo'}
        modulePublic={storySet.modulePublic}
        moduleUserGlobal={storySet.moduleUserGlobal}
        moduleUserLocal={storySet.moduleUserLocal}
        personaKey={storySet.personaKey}
        roles={storySet.roles}
        firebaseUser={storySet.firebaseUser ?? default_fbUser} 
        structureKey={storySet.structureKey ?? 'testStruct'} 
        globals={storySet.globals} filebaseUser={storySet.firebaseUser}
        sessionData={storySet.sessionData} 
        embeddedInstanceData={storySet.embeddedInstanceData}
        gotoInstance={setNavInstance}
        goBack={() => setNavInstance({parent: true})}
        openUrl={url => setNavInstance({url})}
        closeWindow={() => setNavInstance({close: true})}
        urlFragment={storySet.urlFragment}
        onServerCall={onServerCall}
        pushSubscreen={(screenKey,params) => setNavInstance({screenKey, params})}
        serverCall={{...defaultServerCall, ...storySet.serverCall}}
    > 
        {navInstance && <NavResult navInstance={navInstance} />}
        {storySet.content}
        {callLog.length > 0 && <ServerCallLog callLog={callLog} />}
    </Datastore>
}


function runStructureTests(componentDemoFeatures) {
    const structurePages = findStructurePages(componentDemoFeatures);
    if (structurePages.length > 0) {
        test.each(structurePages)('Structure: $label', async page => {
            const rendered = await act(async () =>
                render(<Datastore>{React.createElement(page.screen)}</Datastore>)
            );
            expect(rendered).toMatchSnapshot();
        });
    }
}

function runFeatureTests(componentDemoFeatures) {
    const featurePages = findFeaturePages(componentDemoFeatures);
    if (featurePages.length > 0) {
        test.each(featurePages)('Feature: $label', async page => {
            const rendered = await act(async () => 
                render(<Datastore>{React.createElement(page.screen)}</Datastore>)
            );
            expect(rendered).toMatchSnapshot();
        });
    }
}   
