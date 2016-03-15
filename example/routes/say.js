var $ = require('../routers').server;

var sayController = require('../controllers').say;

$.get('/:word', sayController.word);