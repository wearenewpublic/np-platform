const { TestInstance, WithFeatures } = require("../../util/testutil")
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { pushSubscreen } from '../../util/navigate';
import { features } from '../../feature';
import { flattenFeatureBlocks } from '../../util/features';

jest.mock("../../util/navigate");


const componentDemoFeatures = flattenFeatureBlocks(features['componentdemo']);
// console.log('componentDemoFeatures', componentDemoFeatures);

var pages = [];
componentDemoFeatures.forEach(feature => {
    feature.config.componentSections.forEach(section => {
        section.pages.forEach(page => {
            pages.push(page);
        });
    });
});

describe.each(pages)('Page $label', page => {
    test('Render', async () => {
        render(<TestInstance structureKey='componentdemo' screenKey={page.key} />);
    });
});

