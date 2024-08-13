import React from 'react';
import { render } from '@testing-library/react';
import { features } from '../../feature';
import { flattenFeatureBlocks } from '../../util/features';
import { Datastore } from '../../util/datastore';

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
    test('Render', async () => {
        const rendered = render(<Datastore>{React.createElement(page.screen)}</Datastore>);
        expect(rendered).toMatchSnapshot();
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

