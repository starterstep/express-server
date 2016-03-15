var config = require('../config');

var $ = module.exports = require('mongojs')(config.server.dbUri);

$.on('error', function(err) {
    console.error('Mongojs Error: ', err);
});