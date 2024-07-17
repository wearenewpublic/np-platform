import { SimpleCommentsStructure } from "../../structure/simplecomments";
import { assembleConfig } from "../features";

test('assembleConfig', () => {
    const config = assembleConfig({structure: SimpleCommentsStructure, activeFeatures: {demo: true}});
    expect(config.commentActions.length).toBe(3);
    expect(config.demoAboveMessage).toBe('Comment Above Widget');
});

test('dependent Feature', () => {
    const config = assembleConfig({structure: SimpleCommentsStructure, activeFeatures: {demo: true, demo_secondary: true}});
    expect(config.commentActions.length).toBe(3);
    expect(config.demoAboveMessage).toBe('Modified Message');
})