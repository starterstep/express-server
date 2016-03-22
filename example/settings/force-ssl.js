module.exports = function() {
    require('express-server').server.use(require('express-force-ssl'));
};