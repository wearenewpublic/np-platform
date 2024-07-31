import React from 'react';
import { render } from '@testing-library/react';
import { features } from '../../feature';
import { flattenFeatureBlocks } from '../../util/features';
import { Datastore } from '../../util/datastore';

jest.mock("../../util/navigate");


const componentDemoFeatures = flattenFeatureBlocks(features['componentdemo']);

var pages = [];
componentDemoFeatures.forEach(feature => {
    feature.config.componentSections.forEach(section => {
        section.pages.forEach(page => {
            pages.push(page);
        });
    });
});

describe.each(pages)('$label', page => {
    test('Render', async () => {
        const rendered = render(<Datastore>{React.createElement(page.screen)}</Datastore>);
        expect(rendered).toMatchSnapshot();
    });
});


