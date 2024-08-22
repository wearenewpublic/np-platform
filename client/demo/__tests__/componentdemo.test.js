import React from 'react';
import { render } from '@testing-library/react';
import { features } from '../../feature';
import { flattenFeatureBlocks } from '../../util/features';
import { Datastore } from '../../util/datastore';
import { testStoryActionListAsync } from '../../util/testutil';
import { default_fbUser } from '../../component/demo';

jest.mock("../../util/navigate");


const componentDemoFeatures = flattenFeatureBlocks(features['componentdemo']);

var componentPages = [];
var structurePages = [];
var featurePages = [];
componentDemoFeatures.forEach(feature => {
    feature.config.componentSections?.forEach(section => {
        section.pages.forEach(page => {
            componentPages.push(page);
        });
    });
    feature.config.structureSections?.forEach(section => {
        section.pages.forEach(page => {
            structurePages.push(page);
        });
    });
    feature.config.featureSections?.forEach(section => {
        section.pages.forEach(page => {
            featurePages.push(page);
        });
    });
});

describe.each(componentPages)('Components: $label', page => {
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
                sessionData={storySet.sessionData} serverCall={storySet.serverCall}>
                {storySet.content}
            </Datastore>);
            await testStoryActionListAsync(story.actions);
            expect(rendered).toMatchSnapshot();            
        });
    });
});

if (structurePages.length > 0) {
    test.each(structurePages)('Structure: $label', page => {
        const rendered = render(<Datastore>{React.createElement(page.screen)}</Datastore>);
        expect(rendered).toMatchSnapshot();
    });
}

if (featurePages.length > 0) {
    test.each(featurePages)('Feature: $label', page => {
        const rendered = render(<Datastore>{React.createElement(page.screen)}</Datastore>);
        expect(rendered).toMatchSnapshot();
    });
}



var componentPages = [];
componentDemoFeatures.forEach(feature => {
    feature.config.componentSections?.forEach(section => {
        section.pages.forEach(page => {
            componentPages.push(page);
        });
    });
});

