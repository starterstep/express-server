var $ = require('./');

$.load({
    settings: {
        include: ['server', 'session']
    },
    db: {
        exclude: ['mongojs']
    }
}).start();