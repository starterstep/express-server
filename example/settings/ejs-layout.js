module.exports = function(context) {
    context.app.use(require('express-ejs-layouts'));
    console.log('Loaded Layouts');
};