var es = require('express-server');
var sayController = es.controllers.say;

var $ = es.routers.server;

$.get('/:word', sayController.word);