import {mockServerStore} from "../../util/serverstore";
import {runTriggersApi} from "../derivedviews";

test('runTriggersApi', async () => {
    const serverstore = mockServerStore({structureKey: 'simplecomments'});
    serverstore.setObject('comment', '1', {text: 'Hello', from: 'testuser', key: 1});
    serverstore.commitDataAsync();

    await runTriggersApi({serverstore, type: 'comment', key: '1'});
    await serverstore.commitDataAsync();

    const linkedComment = await serverstore.getRemoteObjectAsync({
        structureKey: 'profile', instanceKey: 'testuser', type: 'derived_comment', key: '1'
    });
    expect(linkedComment.text).toBe('Hello');
});

