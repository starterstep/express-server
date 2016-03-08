module.exports = function(context) {
    var flash = require('connect-flash');
    context.server.use(flash());

    context.server.use(function(req, res, next) {
        res.locals.success_messages = req.flash('success_messages');
        res.locals.error_messages = req.flash('error_messages');
        next();
    });
};