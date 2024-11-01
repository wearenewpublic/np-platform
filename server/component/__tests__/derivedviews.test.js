const { triggerOnGlobalWrite } = require("../../derived-views/templates");
const { mockServerStore } = require("../../util/serverstore");
const { logData, getTestData } = require("../../util/testutil");
const { runTriggersApi, runGlobalTriggersAsync } = require("../derivedviews");

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

function testGlobalTrigger({serverstore, globalKey, value}) {
    serverstore.setModulePublic('testModule', 'testGlobal', value);
}

test('runGlobalTriggersApi', async () => {
    const derivedViews = [
        triggerOnGlobalWrite('testStruct', 'testGlobal', testGlobalTrigger)
    ]
    const serverstore = mockServerStore();
    serverstore.setGlobalProperty('testGlobal', 'Hello');
    runGlobalTriggersAsync({serverstore, globalKey: 'testGlobal', value: 'Hello', derivedViews});
    await serverstore.commitDataAsync();
    expect(getTestData()).toMatchSnapshot();

    jest.resetModules();
});
