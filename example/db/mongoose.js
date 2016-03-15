var config = require('../config');

var $ = module.exports = require('mongoose');

$.connect(config.server.dbUri);

if (process.env.NODE_ENV === 'development') {
    $.set('debug', true);
}