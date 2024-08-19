const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { verifyIdTokenAsync } = require('./firebaseutil');
const { Server } = require('http');
const { ServerStore } = require('./serverstore');
const { getIsUserAdminAsync } = require('./admin');
const cors = require('cors')({origin: true})

function handleApiRequest(req, res, components) {
    const contentType = req.headers['content-type'] || '';

    console.log('api request', req.method, req.path, contentType);
    if (req.method == 'OPTIONS') {
        cors(req, res, () => {
            res.status(200);
        });
        return;
    } else if (req.method === 'POST') {  
        if (contentType.includes('multipart/form-data')) {
            handleMultipartRequest(req, res, components);
        } else if (contentType.includes('application/json')) {
            handleJsonRequest(req, res, components);
        } else {
            res.status(415).send({error: 'Unsupported Content-Type'});
        }
    } else {
        res.status(415).send({error: 'Unsupported HTTP Method'});
    }   
}

exports.handleApiRequest = handleApiRequest;


 
function handleMultipartRequest(req, res, components) {
    const busboy = Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    let fileWrites = [];
    let fields = {};

    busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, fileInfo) => {
        const filepath = path.join(tmpdir, fileInfo.filename);
        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        const promise = new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fields[fieldname] = filepath;
        fileWrites.push(promise);
    });

    busboy.on('finish', async () => {
        await Promise.all(fileWrites);

        const {statusCode, result} = await callApiFunctionAsync(req, fields, components);

        cors(req, res, () => {
            res.status(statusCode);
            res.send(result);
        });
    });

    busboy.end(req.rawBody);
}

async function handleJsonRequest(request, response, components) {
    const fields = {...request.query, ...request.body};
    const {statusCode, result} = await callApiFunctionAsync(request, fields, components);
    cors(request, response, () => {
        response.status(statusCode);
        response.send(result);
    })
}


async function getValidatedUser(req) {
    const tokenId = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
    if (!tokenId || tokenId == 'none') {
        return null;
    } 
    try {
        const decodedToken = await verifyIdTokenAsync(tokenId);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return 'error';
    }
}


async function callApiFunctionAsync(request, fields, components) {
    try {
        const {componentId, apiId} = parsePath(request.path);

        const component = components[componentId];
        var apiFunction = component?.publicFunctions?.[apiId];
        const adminFunction = component?.adminFunctions?.[apiId];
        const user = await getValidatedUser(request);
        const userId = user?.uid ?? null;
        const userEmail = user?.email ?? null;
        const params = {...request.query, ...fields, userId, userEmail};

        const serverstore = new ServerStore(params);

        if (adminFunction) {
            const isAdmin = await getIsUserAdminAsync({serverstore});
            if (!isAdmin) {
                return ({statusCode: 401, result: JSON.stringify({success: false, error: 'Not authorized'})});
            } else {
                apiFunction = adminFunction;
            }
        }

        if (userId == 'error') {
            return ({statusCode: 500, result: JSON.stringify({success: false, error: 'Error validating user'})});
        } else if (!component) {
            return ({statusCode: 400, result: JSON.stringify({success: false, error: 'Unknown component', path: request.path, componentId, apiId})});
        } else if (!apiFunction) {
            console.error('Unknown API', apiId, "expected one of", Object.keys({...component.publicFunctionsFunctions, ...component.adminFunctions}));
            return ({statusCode: 400, result: JSON.stringify({success: false, error: 'Unknown api', path: request.path, componentId, apiId})});
        }

        const apiResult = await apiFunction({serverstore, ...params}); 
        await serverstore.commitDataAsync();

        if (apiResult?.data) {
            return ({statusCode: 200, result: JSON.stringify({success: true, data: apiResult.data})});
        } else if (apiResult?.error) {
            return ({statusCode: 400, result: JSON.stringify({success: false, error: apiResult.error})});
        } else if (apiResult?.success) {
            return ({statusCode: 200, result: JSON.stringify({success: true})})
        } else {
            return ({statusCode: 200, result: JSON.stringify({success: true, data: apiResult ?? null})})
        }
    } catch (error) {
        console.error('Error in callApiFunctionAsync', error);
        return ({statusCode: 500, result: JSON.stringify({success: false, error: error.message})});
    }
}
exports.callApiFunctionAsync = callApiFunctionAsync;

function parsePath(path) {
    var parts = path.split('/').filter(x => x);
    if (parts[0] == 'api') {
        parts = parts.slice(1);
    }
    return {
        componentId: parts[0],
        apiId: parts[1],
    }
}
exports.parsePath = parsePath;

