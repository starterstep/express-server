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
    $.server = $.express();

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

            exclude = exclude ||[];
            exclude.push('index');

            return loadDirectory($).load({
                object: $[name],
                path: path,
                include: include,
                exclude: exclude
            });
        };

        var load = function() {
            _.each(dirs, function(dir) {
                var path = dir + '/' + name;
                if (fs.existsSync(path)) {
                    process(path);
                }
            });
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

        //templates
        processDirectory(_.extend({
            name: 'templates',
            compile: true
        }, options.templates));

        //views
        processDirectory(_.extend({
            name: 'views',
            compile: true
        }, options.views));

        //lib
        processDirectory(_.extend({
            name: 'lib'
        }, options.lib));

        //settings
        processDirectory(_.extend({
            name: 'settings'
        }, options.settings));

        //plugins
        processDirectory(_.extend({
            name: 'plugins'
        }, options.plugins));

        //schemas
        processDirectory(_.extend({
            name: 'schemas'
        }, options.schemas));

        //models
        processDirectory(_.extend({
            name: 'models'
        }, options.models));

        //managers
        processDirectory(_.extend({
            name: 'managers'
        }, options.managers));

        //controllers
        processDirectory(_.extend({
            name: 'controllers'
        }, options.controllers));

        //routers
        processDirectory(_.extend({
            name: 'routers'
        }, options.routers));

        //routes
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

    $.start = function(callback) {
        $.server.listen($.server.get('port'), function() {
            console.log('express-server listening on port ' + $.server.get('port'));
            return callback && callback(null, $);
        });
        return $;
    };

    return $;
};