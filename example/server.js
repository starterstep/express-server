require('../')().load({
    settings: {
        include: ['server', 'session']
    },
    db: {
        exclude: ['mongojs']
    }
}).server();