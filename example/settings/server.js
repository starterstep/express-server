process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var multer = require('multer');
var errorhandler = require('errorhandler');

module.exports = function(context) {
    var app = context.app;
    var express = context.express;
    
    app.set('case sensitive routing', true);
    app.set('port', process.env.PORT || 3000);
    app.set('views', ['./views']);
    app.set('view engine', 'ejs');
    app.use(express.static('./public'));
    app.use(favicon('./public/favicon.ico'));
    app.use(logger('common'));
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.text({
        type:'text/xml'
    }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(multer().single());
    app.use(cookieParser());

    if (process.env.NODE_ENV === 'development') {
        app.use(errorhandler());
    }
};