var ps = require('child_process');

module.exports = function(context) {
    var $ = {};

    $.outloud = function(word) {
        return ps.execSync('say "'+word+'"');
    };

    return $;
};