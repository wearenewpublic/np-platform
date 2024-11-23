
var global_user = {
    uid: 'testuser',
    email: 'test@test.org',
    displayName: 'Test User',
    photoURL: 'photo-url'
    // photoURL: 'https://test.org/photo.jpg'
};
const verifyIdToken = jest.fn();
exports.verifyIdToken = verifyIdToken;

const getUserByEmail = jest.fn();
exports.getUserByEmail = getUserByEmail;

const createUser = jest.fn();
exports.createUser = createUser;

const getUser = jest.fn();
exports.getUser = getUser;

const createCustomToken = jest.fn();
exports.createCustomToken = createCustomToken;

const listUsers = jest.fn();
exports.listUsers = listUsers;

var global_data = {};
var global_next_key = 1;

async function clearTestData() {
    global_data = {};
    global_next_key = 1;
}
exports.clearTestData = clearTestData

async function setTestData(data) {
    global_data = data;
}
exports.setTestData = setTestData;

function logData() {
    console.log(JSON.stringify(global_data, null, 2));
}
exports.logData = logData;

exports.getTestData = () => global_data;

async function writeTestData(path, value) {
    const parts = path.split('/').filter(part => part);
    var result = global_data;
    const prefix = parts.slice(0, -1);
    const lastField = parts[parts.length - 1];
    prefix.forEach(part => {
        if (result[part] == undefined) {
            result[part] = {};
        }
        result = result[part];
    });
    result[lastField] = value;
}
exports.writeTestData = writeTestData;

async function readTestData(path) {
    const parts = path.split('/').filter(part => part);
    var result = global_data;
    parts.forEach(part => {
        result = result?.[part];
    });
    return result;
}
exports.readTestData = readTestData;

async function updateTestData(path, updateMap) {
    const keys = Object.keys(updateMap);
    keys.forEach(key => {
        writeTestData(path + '/' + key, updateMap[key]);
    });
}

async function readFilteredTestData(path, key, value) {
    const items = await readTestData(path);
    var filtered = {};
    for (var itemKey in items) {
        const item = items[itemKey];
        if (item[key] == value) {
            filtered[itemKey] = item;
        }
    }
    return filtered;
}

const fakeFirebaseAdmin = {
    auth: () => ({
        getUser: async uid => global_user, 
        verifyIdToken, getUserByEmail, createUser,
        createCustomToken, listUsers
    }), 
    database: () => ({
        ref: path => ({
            set: value => writeTestData(path, value),
            once: () => ({val: () => readTestData(path)}),
            update: updateMap => updateTestData(path, updateMap),
            orderByChild: key => ({
                equalTo: value => ({
                    once: () => ({
                        val: () => readFilteredTestData(path, key, value)
                    })
                })
            }),
            orderByKey: key => ({
                startAfter: startAfter => ({
                    limitToFirst: limit => ({
                        once: async () => {
                            const items = await readTestData(path);
                            const keys = Object.keys(items).sort();
                            const start = keys.indexOf(startAfter) + 1;
                            const end = start + limit;
                            const result = {};
                            keys.slice(start, end).forEach(key => {
                                result[key] = items[key];
                            });
                            return {val: () => result};
                        }
                    })
                }),
                limitToFirst: limit => ({
                    once: async () => {
                        const items = await readTestData(path);
                        const keys = Object.keys(items).sort();
                        const result = {};
                        keys.slice(0, limit).forEach(key => {
                            result[key] = items[key];
                        });
                        return {val: () => result};
                    }
                }),
            }),
            push: () => ({
                key: global_next_key++
            })
        })
    })
}
exports.fakeFirebaseAdmin = fakeFirebaseAdmin;
