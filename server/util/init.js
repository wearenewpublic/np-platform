const functions = require('firebase-functions');
const admin = require('firebase-admin');

function initNpFirebase(config) {
    admin.initializeApp(config);
}
exports.initNpFirebase = initNpFirebase;

