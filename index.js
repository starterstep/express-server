var loadDirectory = require('./lib/load-directory');
var loadYamlDirectory = require('./lib/load-yaml-directory')();
var compileDirectory = require('./lib/compile-directory')();
var nodeConsole = require('./lib/node-console');
var _ = require('underscore');
var fs = require('fs');

module.exports = function(dirs) {
    dirs = dirs || process.cwd();
    if (!_.isArray(dirs)) {
        dirs = [dirs];
    }

    var $ = {};

    $.express = require('express');
    $.app = $.express();

    var processDirectory = function(params) {
        var name = params.name;
        var compile = params.compile;
        var yaml = params.yaml;
        var include = params.include;
        var exclude = params.exclude;
        var times = params.times || 1;

        $[name] = {};

        var process = function(path) {
            if (compile) {
                return compileDirectory.compile({
                    object: $[name],
                    path: path,
                    include: include,
                    exclude: exclude
                });
            }
            if (yaml) {
                return loadYamlDirectory.load({
                    object: $[name],
                    path: path,
                    include: include,
                    exclude: exclude
                });
            }
            return loadDirectory($).load({
                object: $[name],
                path: path,
                include: include,
                exclude: exclude
            });
        };

        var load = function() {
            var indexes = [];
            _.each(dirs, function(dir) {
                var path = dir + '/' + name;
                if (fs.existsSync(path)) {
                    process(path);
                    if ($[name].index) {
                        indexes.push($[name].index);
                    }
                }
            });
            if (indexes.length) {
                _.each(indexes, function(index, count) {
                    if (count === 0) {
                        $[name].index = index;
                    } else {
                        _.extend($[name].index, index);
                    }
                });
                var index = $[name].index;
                delete $[name].index;
                $[name] = _.extend(index, $[name]);
            }
        };

        _.times(times, function() {
            load();
        });
        console.log('loaded ' + name + ': ', _.keys($[name]));
        return $[name];
    };

    $.load = function(options) {
        options = options || {};

        //config
        processDirectory(_.extend({
            name: 'config',
            yaml: true
        }, options.config));

        //db
        processDirectory(_.extend({
            name: 'db'
        }, options.db));

        //lib
        processDirectory(_.extend({
            name: 'lib',
            times: 2
        }, options.lib));

        //settings
        processDirectory(_.extend({
            name: 'settings'
        }, options.settings));

        //templates
        processDirectory(_.extend({
            name: 'templates',
            compile: true
        }, options.templates));

        //models
        processDirectory(_.extend({
            name: 'models'
        }, options.models));

        //managers
        processDirectory(_.extend({
            name: 'managers',
            times: 2
        }, options.managers));

        //controllers
        processDirectory(_.extend({
            name: 'controllers'
        }, options.controllers));

        //routes
        $.router = $.express.Router();
        $.app.use($.router);

        processDirectory(_.extend({
            name: 'routes'
        }, options.routes));

        //events
        processDirectory(_.extend({
            name: 'events'
        }, options.events));

        return $;
    };

    $.console = function() {
        nodeConsole($);
        return $;
    };

    $.server = function(callback) {
        $.app.listen($.app.get('port'), function() {
            console.log('express-server listening on port ' + $.app.get('port'));
            return callback && callback(null, $);
        });
        return $;
    };

    return $;
};