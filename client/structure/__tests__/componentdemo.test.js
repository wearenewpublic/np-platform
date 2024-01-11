const { act } = require("react-test-renderer");
const { makeTestInstanceAsync } = require("../../util/test")

jest.mock('../../util/firebase');

test('Menu screen renders', async () => {
    await act(async () => {
        const renderer = await makeTestInstanceAsync({
            structureKey: 'componentdemo', instanceKey: 'demo'});
        renderer.unmount();    
    })
})
