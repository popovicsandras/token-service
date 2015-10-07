'use strict';

var url = require('url');
var CirrusAuthentication = require('../auth/Cirrus');

var Authentication = function(strategy) {
    this.strategy = strategy ? strategy : new CirrusAuthentication();
};

Authentication.prototype = {

    sessionChecker: function(request, response, next) {

        var goOnAsAuthenticated = authenticated.bind(this, request, next),
            goOnAsUnauthenticated = unAuthenticated.bind(this, next),
            sessionId = getSessionId(request.url);

        this.strategy.check(sessionId)
            .then(goOnAsAuthenticated)
            .catch(goOnAsUnauthenticated);
    }
};

module.exports = Authentication;

function getSessionId(urlString) {
    var url_parts = url.parse(urlString, true),
        query = url_parts.query;

    return query.sessionid;
}

function authenticated(request, next, UserUuid) {
    request.userUuid = UserUuid;
    next();
}

function unAuthenticated(next, errorMessage) {
    next(errorMessage);
}

