var es = require('express-server');
var config = es.config;

var $ = module.exports = require('mongoose');

$.connect(config.server.dbUri);

if (process.env.NODE_ENV === 'development') {
    $.set('debug', true);
}