var ps = require('child_process');

var $ = module.exports = {};

$.outloud = function(word) {
    return ps.execSync('say "'+word+'"');
};