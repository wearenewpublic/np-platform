import { ComponentDemoStructure } from "../../structure/componentdemo";
import { SimpleCommentsStructure } from "../../structure/simplecomments";
import { assembleConfig } from "../features";

test('assembleConfig', () => {
    const config = assembleConfig({structure: ComponentDemoStructure, activeFeatures: {demo: true}});
    expect(config.widgets.length).toBe(2);
    expect(config.demoMessage).toBe('Demo Widget');
});

test('dependent Feature', () => {
    const config = assembleConfig({structure: ComponentDemoStructure, activeFeatures: {demo: true, demo_secondary: true}});
    expect(config.widgets.length).toBe(2);
    expect(config.demoMessage).toBe('Modified Message');
})