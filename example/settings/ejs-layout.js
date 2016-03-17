module.exports = function() {
    require('../').server.use(require('express-ejs-layouts'));
};