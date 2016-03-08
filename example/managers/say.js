module.exports = function(context) {
    var bus = context.lib.bus;
    var say = context.lib.say;
    var WordModel = context.models.word;

    var $ = {};

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

    return $;
};

exports.load = function(context) {

};