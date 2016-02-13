require('../')().load({
    settings: {
        include: ['index', 'session']
    },
    db: {
        exclude: ['mongojs']
    }
}).server();