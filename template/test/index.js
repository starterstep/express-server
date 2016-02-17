module.exports = function(callback) {
    server = require('express-server')().load();
    callback();
};