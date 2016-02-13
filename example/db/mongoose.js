module.exports = function(context) {
    var mongoose = require('mongoose');

    mongoose.connect(context.config.dbUri);

    if (process.env.NODE_ENV === 'development') {
        mongoose.set('debug', true);
    }

    console.log('Loaded Mongoose: ' + context.config.dbUri);
    return mongoose;
};