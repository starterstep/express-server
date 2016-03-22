var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var es = require('express-server');
var config = es.config;

es.server.use(session({
    secret: 'express-server-secret',
    store: new MongoStore({
        url: config.server.dbUri
    })
}));