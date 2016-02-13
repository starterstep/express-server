module.exports = function(callback) {
    server = require('../../')().load();
    callback();
};