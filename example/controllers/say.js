module.exports = function(context) {
    var $ = {};

    var responseHelper = context.lib.responseHelper;
    var sayManager = context.managers.say;

    $.word = function(req, res) {
        sayManager.word(req.params.word, function(err, result) {
            responseHelper.render(err, 'say', {
                word: result.word
            }, res);
        });
    };

    return $;
};