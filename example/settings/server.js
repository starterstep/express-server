process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var multer = require('multer');
var errorhandler = require('errorhandler');

var context = require('../');
var server = context.server;
var express = context.express;

server.set('case sensitive routing', true);
server.set('port', process.env.PORT || 3000);
server.set('views', ['./views']);
server.set('view engine', 'ejs');
server.use(express.static('./public'));
server.use(favicon('./public/favicon.ico'));
server.use(logger('common'));
server.use(methodOverride());
server.use(bodyParser.json());
server.use(bodyParser.text({
    type:'text/xml'
}));
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(multer().single());
server.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    server.use(errorhandler());
}