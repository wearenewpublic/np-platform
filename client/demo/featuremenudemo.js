// The features in this file exist purely to demonstrate the structure
// of the admin feature selector UI.

import { ConversationScreen, Narrow } from "../component/basics"
import { DemoSection } from "../component/demo"
import { FormField } from "../component/form"
import { CHOOSEONE, COMPOSITE, SECTION } from "../feature"
import { FeatureTreeNode } from "../organizer/TopBar"
import { Datastore } from "../util/datastore"

export const DogFeature = { key: 'dog', name: 'Dog' }
export const CatFeature = { key: 'cat', name: 'Cat' }
export const KomodoDragonFeature = { key: 'komodo_dragon', name: 'Komodo Dragon' }
export const ColorPinkFeature = { key: 'color_pink', name: 'Pink', parentFeature: 'pet_sitting'}
export const ColorGreenFeature = { key: 'color_green', name: 'Green', parentFeature: 'pet_sitting' }
export const PetSittingFeature = { key: 'pet_sitting', name: 'Pet Sitting' }
export const GroomingFeature = { key: 'grooming', name: 'Grooming' }
export const WalkingFeature = { key: 'walking', name: 'Walking', parentFeature: 'pet_sitting' }

const demoFeatures = SECTION('Demo Feature Menu', [
    COMPOSITE(PetSittingFeature, [
        CHOOSEONE('Pet Type', [DogFeature, CatFeature, KomodoDragonFeature]),
        CHOOSEONE('Fur Dye Color', [ColorPinkFeature, ColorGreenFeature]),
        SECTION('Extra Services', [
            GroomingFeature,
            WalkingFeature
        ])
    ]),
]);

export function FeatureMenuScreen() {
    return <ConversationScreen>
        <Narrow>
            <Datastore>
                <DemoSection label='Section'>
                    <FeatureTreeNode featureBlock={demoFeatures} />
                </DemoSection>
                <DemoSection label='Composite'>
                    <FeatureTreeNode featureBlock={demoFeatures.features[0]} />
                </DemoSection>
                <DemoSection label='ChooseOne'>
                    <FeatureTreeNode featureBlock={demoFeatures.features[0].features[0]} />
                </DemoSection>
            </Datastore>
        </Narrow>
    </ConversationScreen>
}