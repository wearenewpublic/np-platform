const { mockServerStore } = require("../../util/serverstore");
const { runTriggersApi } = require("../derivedviews");

test('runTriggersApi', async () => {
    const serverstore = mockServerStore({structureKey: 'simplecomments'});
    await serverstore.setObjectAsync('comment', '1', {text: 'Hello', from: 'testuser', key: 1});

    await runTriggersApi({serverstore, type: 'comment', key: '1'});

    const linkedComment = await serverstore.getRemoteObjectAsync({
        structureKey: 'profile', instanceKey: 'testuser', type: 'derived_comment', key: '1'
    });
    expect(linkedComment.text).toBe('Hello');
});

