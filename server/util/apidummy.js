const functions = require('firebase-functions');
const admin = require('firebase-admin');

const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');

console.log('about to import components');

const { components } = require('../component');
const cors = require('cors')({origin: true})

function dummyApiHandler(req,res) {
    console.log('api request', req.method, req.path);
    res.send('Hello from NP Platform with components except storage!');
}
exports.dummyApiHandler = dummyApiHandler;

