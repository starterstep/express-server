var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var context = require('../');
var config = require('../config');

context.server.use(session({
    secret: 'express-server-secret',
    store: new MongoStore({
        url: config.server.dbUri
    })
}));