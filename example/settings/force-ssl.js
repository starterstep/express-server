module.exports = function(context) {
    context.app.use(require('express-force-ssl'));
    console.log('Loaded Force SSL');
};