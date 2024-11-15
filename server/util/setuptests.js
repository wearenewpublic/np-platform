const { setFirebaseAdmin } = require("./firebaseutil");
const { fakeFirebaseAdmin, clearTestData } = require("./testutil");

clearTestData();
setFirebaseAdmin(fakeFirebaseAdmin);

jest.mock('axios');
jest.mock('postmark');
jest.mock('jsonwebtoken');
jest.mock('cors');

jest.useFakeTimers();
jest.setSystemTime(1000);

beforeEach(() => {
    clearTestData();
});
