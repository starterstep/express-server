module.exports = function(context) {
    var session = require('express-session');
    var MongoStore = require('connect-mongo/es5')(session);

    context.app.use(session({
        secret: 'express-server-secret',
        store: new MongoStore({
            url: context.config.dbUri
        })
    }));
};