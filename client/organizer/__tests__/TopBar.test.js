import { render, screen } from "@testing-library/react";
import { WithFeatures, setFeatures } from "../../util/testutil";
import { FeatureToggles, TopBar } from "../TopBar";

test('TopBar Renders', () => {
    render(<WithFeatures><TopBar /></WithFeatures>);
});

test('Feature Toggles', () => {
    render(<WithFeatures structureKey="simplecomments"><FeatureToggles /></WithFeatures>);
    screen.getByText('Demo Feature');
    expect(screen.queryByText('Demo Secondary Feature')).toBeNull();
})

test('Secondary Feature Toggles', () => {
    setFeatures({demo: true});
    render(<WithFeatures structureKey='simplecomments' features={{demo: true}}><FeatureToggles /></WithFeatures>);
    screen.getByText('Demo Feature');
    screen.getByText('Demo Secondary Feature');
})