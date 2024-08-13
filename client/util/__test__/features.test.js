import { SimpleCommentsStructure } from "../../structure/simplecomments";
import { assembleConfig } from "../features";

test('assembleConfig', () => {
    const config = assembleConfig({structure: SimpleCommentsStructure, activeFeatures: {config_comment: true}});
    expect(config.commentActions.length).toBe(2);
    expect(config.demoAboveMessage).toBe('Comment Above Widget');
});

test('dependent Feature', () => {
    const config = assembleConfig({structure: SimpleCommentsStructure, activeFeatures: {config_comment: true, demo_secondary: true}});
    expect(config.commentActions.length).toBe(2);
    expect(config.demoAboveMessage).toBe('Modified Message');
})