var es = require('express-server');

var bus = es.lib.bus;
var say = es.lib.say;
var WordModel = es.models.word;

var $ = module.exports = {};

$.word = function(word, callback) {
    say.outloud(word);

    bus.emit('said', word);

    new WordModel({
        word: word
    }).save(callback);
};

$.removeAll = function(callback) {
    WordModel.remove({}, callback);
};