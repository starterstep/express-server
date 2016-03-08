module.exports = function(context) {
    context.server.use(require('express-force-ssl'));
};