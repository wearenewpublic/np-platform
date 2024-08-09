
var global_user = {
    uid: 'testuser',
    email: 'test@test.org',
    displayName: 'Test User'
};
const verifyIdToken = jest.fn();


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
        verifyIdToken
    }), 
    database: () => ({
        ref: path => ({
            set: value => writeTestData(path, value),
            once: () => ({val: () => readTestData(path)}),
            update: updateMap => updateTestData(path, updateMap),
            // update: async value => {
            //     const old = await readTestData(path);
            //     const updated = {...old, ...value};
            //     writeTestData(path, updated);
            // },
            orderByChild: key => ({
                equalTo: value => ({
                    once: () => ({
                        val: () => readFilteredTestData(path, key, value)
                    })
                })
            }),
            push: () => ({
                key: global_next_key++
            })
        })
    })
}
exports.fakeFirebaseAdmin = fakeFirebaseAdmin;
