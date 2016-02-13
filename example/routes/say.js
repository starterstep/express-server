module.exports = function(context) {
    var $ = context.router;

    var sayController = context.controllers.say;

    $.get('/:word', sayController.word);
};