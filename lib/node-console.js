var _ = require('underscore');
var s = require('underscore.string');
var m = require('moment');

module.exports = function($) {
    var fromArgs = {};
    process.argv.forEach(function (val, index) {
        if (index > 1) {
            if (val.indexOf('./') !== -1) {
                val = $.baseDir+'/'+val;
            }
            console.log('Console loading ' + val);
            var splits = val.split('/');
            fromArgs[s.camelize(splits[splits.length - 1])] = require(val);
        }
    });

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

    _.extend(context, $);

    _.extend(context, fromArgs);

    return context;
};