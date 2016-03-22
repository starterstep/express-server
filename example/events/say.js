var es = require('express-server');

var bus = es.lib.bus;
var sayTemplate = es.templates.say;

bus.on('said', function(word) {
    console.log('Event said: ', word);
    console.log('Template said: ', sayTemplate({
        word: word
    }));
});