var $ = module.exports = require('../')();

$.load({
    settings: {
        include: ['server', 'session']
    },
    db: {
        exclude: ['mongojs']
    }
}).start();