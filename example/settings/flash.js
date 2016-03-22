module.exports = function() {
    var es = require('express-server');
    var flash = require('connect-flash');
    es.server.use(flash());

    es.server.use(function(req, res, next) {
        res.locals.success_messages = req.flash('success_messages');
        res.locals.error_messages = req.flash('error_messages');
        next();
    });
};