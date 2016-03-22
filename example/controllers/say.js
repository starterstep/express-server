var es = require('express-server');

var $ = module.exports = {};

var responseHelper = es.lib.responseHelper;
var sayManager = es.managers.say;

$.word = function(req, res) {
    sayManager.word(req.params.word, function(err, result) {
        responseHelper.render(err, 'say', {
            word: result.word
        }, res);
    });
};