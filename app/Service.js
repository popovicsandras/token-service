'use strict';

var http = require('http');
var express = require('express');
var Authentication = require('./middlewares/Authentication');

class Service {

    constructor(apis) {
        apis = apis || {};
        this.auth = apis.Authentication ? apis.Authentication: new Authentication();
    }

    start(port) {
        var app = express(),
            auth = this.auth;

        app.use(auth.sessionChecker.bind(auth));

        app.get('/', function(request, response) {
            response.send('user uuid: ' + request.userUuid);
        });

        var server = http.createServer(app);
        server.listen(port, function() {
            console.log('Service started on port ' + port);
        });

        return server;
    }
}

module.exports = Service;
