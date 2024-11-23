import { addDefaultFeatures, addFeatures, defaultFeatureConfig, features, SECTION, UNSAFE_setDefaultFeatures, UNSAFE_setFeatures } from "..";

const TestFeature = {
    key: 'test',
    name: 'Test',
}



describe('addFeatures', () => {
    const oldFeatures = features;

    afterEach(() => {
        UNSAFE_setFeatures(oldFeatures);
    });

    test('addFeatures', () => {
        addFeatures({
            profile: [
                SECTION('Test', [
                    TestFeature
                ])
            ]
        })
        expect(features).toMatchObject({profile: [
            {},{},{label: 'Test', features: [TestFeature]}]});     
        expect(JSON.stringify(features)).toMatchSnapshot();
    });
})

describe('addDefaultFeatures', () => {
    const oldDefaultFeatures = defaultFeatureConfig;

    afterEach(() => {
        UNSAFE_setDefaultFeatures(oldDefaultFeatures);
    });

    test('addDefaultFeatures', () => {
        addDefaultFeatures({
            profile: {
                test: true
            }
        })
        expect(defaultFeatureConfig).toMatchObject({profile: {test: true}});
        expect(JSON.stringify(defaultFeatureConfig)).toMatchSnapshot();
    });
})
