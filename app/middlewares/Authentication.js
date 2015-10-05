'use strict';

var url = require('url');
var http = require('http');

var Authentication = function() {};

function getSessionId(urlString) {
    var url_parts = url.parse(urlString, true),
        query = url_parts.query;

    return query.sessionid;
}

Authentication.prototype = {

    authenticator: function(request, response, next) {

        var options = {
            host: 'qa.workshare.com',
            path: '/api/v1.4/current_user.json',
            headers: {
                'Cookie': 'qa_session_id=' + getSessionId(request.url)
            }
        };

        var callback = function(resp) {
            var userData = '';
            resp.on('data', function (chunk) {
                userData += chunk;
            });
            resp.on('end', function () {

                var user = JSON.parse(userData);
                if (user.uuid) {
                    request.userUuid = user.uuid;
                    next();
                }
                else {
                    var errorMsg = user[0] && user[0].error_msg || 'Undefined error';

                    response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                    response.header('Expires', '-1');
                    response.header('Pragma', 'no-cache');
                    response.status(401).send(errorMsg);

                    next(errorMsg);
                }
            });
        };

        http.request(options, callback).end();
    }
};

module.exports = Authentication;
