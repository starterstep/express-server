var es = require('express-server');
var config = es.config;

var $ = module.exports = require('mongojs')(config.server.dbUri);

$.on('error', function(err) {
    console.error('Mongojs Error: ', err);
});