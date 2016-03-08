module.exports = function(context) {
    var $ = context.routers.server;

    var sayController = context.controllers.say;

    $.get('/:word', sayController.word);
};