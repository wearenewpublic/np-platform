import React from 'react';
import { render } from '@testing-library/react';
import { flattenFeatureBlocks } from './features';
import { Datastore } from './datastore';
import { testStoryActionListAsync } from './testutil';
import { default_fbUser, defaultServerCall } from '../component/demo';

// jest.mock("../../util/navigate");

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
                const rendered = render(<Datastore>{React.createElement(page.screen)}</Datastore>);
                expect(rendered).toMatchSnapshot();
            });
        } 
        if (!page.storySets) return;
        describe.each(page.storySets())('Story: $label', storySet => {
            if (!storySet.stories || storySet.stories.length == 0) return;
            test.each(storySet.stories || [])('Action: $label', async story => {
                const rendered = render(
                <Datastore config={storySet.config} collections={storySet.collections}
                    instanceKey={storySet.instanceKey ?? 'testInstance'} 
                    siloKey={storySet.siloKey ?? 'demo'}
                    modulePublic={storySet.modulePublic}
                    personaKey={storySet.personaKey}
                    firebaseUser={storySet.firebaseUser ?? default_fbUser} 
                    structureKey={storySet.structureKey ?? 'testStruct'} 
                    globals={storySet.globals} filebaseUser={storySet.firebaseUser}
                    sessionData={storySet.sessionData} 
                    serverCall={{...defaultServerCall, ...storySet.serverCall}}> 
                    {storySet.content}
                </Datastore>);
                await testStoryActionListAsync(story.actions);
                expect(rendered).toMatchSnapshot();            
            });
        });
    });
}

function runStructureTests(componentDemoFeatures) {
    const structurePages = findStructurePages(componentDemoFeatures);
    if (structurePages.length > 0) {
        test.each(structurePages)('Structure: $label', page => {
            const rendered = render(<Datastore>{React.createElement(page.screen)}</Datastore>);
            expect(rendered).toMatchSnapshot();
        });
    }
}

function runFeatureTests(componentDemoFeatures) {
    const featurePages = findFeaturePages(componentDemoFeatures);
    if (featurePages.length > 0) {
        test.each(featurePages)('Feature: $label', page => {
            const rendered = render(<Datastore>{React.createElement(page.screen)}</Datastore>);
            expect(rendered).toMatchSnapshot();
        });
    }
}   
