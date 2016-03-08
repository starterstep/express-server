module.exports = function(context) {
    var mongoose = require('mongoose');

    mongoose.connect(context.config.server.dbUri);

    if (process.env.NODE_ENV === 'development') {
        mongoose.set('debug', true);
    }

    return mongoose;
};