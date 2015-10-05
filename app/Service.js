'use strict';

var http = require('http');
var express = require('express');
var Authentication = require('./middlewares/Authentication');
var VersionAPI = require('./api/VersionAPI');

var swaggerUiMiddleware = require('swagger-ui-middleware');

function Service(apis) {
    apis = apis || {};
    this.auth = apis.Authentication ? apis.Authentication: new Authentication();
    this.versionAPI  = apis.versionAPI ? apis.versionAPI : new VersionAPI();
}

Service.prototype = {

    start: function(port) {
        var app = express(),
            auth = this.auth,
            versionAPI = this.versionAPI;

        // /api-doc endpoint
        swaggerUiMiddleware.hostUI(app, {overrides: __dirname + '/../swagger-ui/'});

        app.use(auth.authenticate);

        app.get('/', function(request, response) {
            response.send('gotcha');
        });

        app.get('/admin/version', function(request, response) {
            versionAPI.get(request, response);
        });

        var server = http.createServer(app);
        server.listen(port, function() {
            console.log('Service started on port ' + port);
        });

        return server;
    }
};

module.exports = Service;
