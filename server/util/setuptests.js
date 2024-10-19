import {setFirebaseAdmin} from "./firebaseutil";
import {fakeFirebaseAdmin, clearTestData} from "./testutil";
import {jest} from '@jest/globals';

clearTestData();
setFirebaseAdmin(fakeFirebaseAdmin);

jest.mock('axios');
jest.mock('postmark');

jest.useFakeTimers();
jest.setSystemTime(1000);

beforeEach(() => {
    clearTestData();
});
