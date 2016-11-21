'use strict';

var https = require('https');
var crypto = require('crypto');
var fs = require('fs');

var API_URL = 'api.sendpulse.com';
var API_USER_ID="";
var API_SECRET="";
var TOKEN_STORAGE="";
var TOKEN="";

function md5(data){
    var md5sum = crypto.createHash('md5');
    md5sum.update(data);
    return md5sum.digest('hex');
}


function base64(data){
    var b = new Buffer(data);
    return b.toString('base64');
}

function init(user_id,secret,storage) {
    API_USER_ID=user_id;
    API_SECRET=secret;
    TOKEN_STORAGE=storage;

    var hashName = md5(API_USER_ID+'::'+API_SECRET);
    if (fs.existsSync(TOKEN_STORAGE+hashName)) {
        TOKEN = fs.readFileSync(TOKEN_STORAGE+hashName,{encoding:'utf8'});
    }

    if (! TOKEN.length) {
        getToken();
    }
}

function sendRequest(path, method, data, useToken, callback){
    var headers = {}
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] =  Buffer.byteLength(JSON.stringify(data));

    if (useToken && TOKEN.length) {
        headers['Authorization'] = 'Bearer '+TOKEN;
    }
    if (method === undefined) {
        method = 'POST';
    }
    if (useToken === undefined) {
        useToken = false;
    }

    var options = {
        //uri: API_URL,
        path: '/'+path,
        port: 443,
        hostname: API_URL,
        method: method,
        headers: headers,
    };

    var req = https.request(
        options,
        function(response) {
            var str = '';
            response.on('data', function (chunk) {
                if (response.statusCode==401) {
                    getToken();
                    sendRequest(path, method, data, true, callback);
                } else {
                    str += chunk;
                }
            });

            response.on('end', function () {
                if (response.statusCode != 401) {
                    try {
                        var answer = JSON.parse(str);
                    } catch (ex) {
                        var answer = returnError();
                    }
                    callback(answer);
                }
            });
        }
    );
    req.write(JSON.stringify(data));
    req.end();
}

/**
 * Get token and store it
 *
 */
function getToken(){
    var data={
        grant_type:'client_credentials',
        client_id: API_USER_ID,
        client_secret: API_SECRET
    }
    sendRequest( 'oauth/access_token', 'POST', data, false, saveToken );
    function saveToken(data) {
        TOKEN = data.access_token;
        var hashName = md5(API_USER_ID+'::'+API_SECRET);
        fs.writeFileSync(TOKEN_STORAGE+hashName, TOKEN);
    }
}

function returnError(message){
    var data = {is_error:1};
    if (message !== undefined && message.length) {
        data['message'] = message
    }
    return data;
}

function getSites (callback, limit, offset) {
    var data={}
    if (limit === undefined) {
        limit = null;
    } else {
        data['limit'] = limit;
    }
    if (offset === undefined) {
        offset = null;
    } else {
        data['offset'] = offset;
    }
    sendRequest('push/websites', 'GET', data, true, callback);
}

function variables (callback) {
    var data={};
    sendRequest('push/websites/9994/subscriptions', 'GET', data, true, callback);
}

function createPush (callback, title, id, body, ttl) {
    var data = {
        title: title,
        website_id: id,
        body: body,
        ttl: ttl
    }
    sendRequest( 'push/tasks', 'POST', data, true, callback );
}



exports.init = init;
exports.getSites = getSites;
exports.createPush = createPush;
exports.variables = variables;

