module.exports = function(context) {
    var bus = context.lib.bus;
    var sayTemplate = context.templates.say;

    bus.on('said', function(word) {
        console.log('Event said: ', word);
        console.log('Template said: ', sayTemplate({
            word: word
        }));
    });
};