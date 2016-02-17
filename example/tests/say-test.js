var should = require('should');
var fixture = require('./fixture');

var sayManager = server.managers.say;

describe("Hello World", function() {

    beforeEach(function(done) {
        sayManager.removeAll(done);
    });

    afterEach(function(done) {
        done();
    });

    it('should say hello world', function(done) {
        var word = fixture.helloWorld();
        sayManager.word(word, function(err, result) {
            if (err) {
                return done(err);
            }
            word.should.equal(result.word);
            done();
        });
    });
});