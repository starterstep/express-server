var bus = require('../lib').bus;
var sayTemplate = require('../templates').say;

bus.on('said', function(word) {
    console.log('Event said: ', word);
    console.log('Template said: ', sayTemplate({
        word: word
    }));
});