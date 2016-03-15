var bus = require('../lib').bus;
var say = require('../lib').say;
var WordModel = require('../models').word;

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