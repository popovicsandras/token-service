'use strict';

var url = require('url');

var Authentication = function() {};

function getSessionId(urlString) {
    var url_parts = url.parse(urlString, true),
        query = url_parts.query;

    return query.sessionid
}

Authentication.prototype = {

    authenticate: function(request, response, next) {

        response.send(getSessionId(request.url));
        next();
    }
};

module.exports = Authentication;
