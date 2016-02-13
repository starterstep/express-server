module.exports = function(context) {
    var mongojs = require('mongojs')(context.config.dbUri);

    mongojs.on('error', function(err) {
        console.error('Mongojs Error: ', err);
    });

    console.log('Loaded Mongojs: ' + context.config.dbUri);
    return mongojs;
};