var _ = require('underscore');
var s = require('underscore.string');
var m = require('moment');

module.exports = function($) {
    var repl = require('repl').start({
        useGlobal: true,
        ignoreUndefined: true,
        prompt: 'express-server > '
    });

    var context = repl.context;

    context.u = _;
    context.s = s;
    context.m = m;

    context.cb = function (err, result) {
        context.err = err;
        context.result = result;
    };

    _.extend(context, _.omit($,'console'))
    return context;
};
