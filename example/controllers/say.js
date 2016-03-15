var $ = module.exports = {};

var responseHelper = require('../lib').responseHelper;
var sayManager = require('../managers').say;

$.word = function(req, res) {
    sayManager.word(req.params.word, function(err, result) {
        responseHelper.render(err, 'say', {
            word: result.word
        }, res);
    });
};