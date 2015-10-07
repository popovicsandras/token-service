'use strict';

var http = require('http');

function CirrusAuthentication() {}

CirrusAuthentication.prototype = {

    check: function(sessionId) {
        return new Promise(this.sendCheckerRequest.bind(this, sessionId));
    },

    sendCheckerRequest: function(sessionId, resolve, reject) {

        var options = {
            host: 'qa.workshare.com',
            path: '/api/v1.4/current_user.json',
            headers: {
                'Cookie': 'qa_session_id=' + sessionId
            }
        };

        http.request(options, this.onSessionCheck.bind(this, resolve, reject)).end();
    },

    onSessionCheck: function(resolve, reject, resp) {

        var userData = '';

        resp.on('data', function (chunk) {
            userData += chunk;
        });

        resp.on('end', function () {

            var user = JSON.parse(userData);
            if (user.uuid) {
                resolve(user.uuid);
            }
            else {
                var errorMsg = user[0] && user[0].error_msg || 'Undefined error';
                reject(errorMsg);
            }
        });
    }
};

module.exports = CirrusAuthentication;