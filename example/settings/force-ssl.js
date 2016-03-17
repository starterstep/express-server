module.exports = function() {
    require('../').server.use(require('express-force-ssl'));
};