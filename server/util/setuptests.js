const { setFirebaseAdmin } = require("./firebaseutil");
const { fakeFirebaseAdmin, clearTestData } = require("./testutil");

clearTestData();
setFirebaseAdmin(fakeFirebaseAdmin);

jest.mock('axios');
jest.mock('postmark');
jest.mock('fs');

