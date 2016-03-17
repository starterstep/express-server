var nodeConsole = require('./lib/node-console');
var _ = require('underscore');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var s = require('underscore.string');
var yamlConfig = require('yaml-config');
var ejs = require('ejs');


module.exports = function($) {
    $ = $ || {};

    var map = ['config', 'db', 'templates', 'views', 'lib', 'settings', 'plugins', 'schemas', 'models', 'managers', 'controllers', 'routers', 'routes', 'events'];

    if (!$.express) {
        $.express = require('express');
    }
    if (!$.server) {
        $.server = $.express();
    }

    var mapRequire = function(moduleName, files) {
        var module = $[moduleName] || ($[moduleName] = {});

        var log = [];

        var splitRefFile = function(ref, split, file) {
            if (file.indexOf('.yaml') !== -1) {
                ref[split] = ref[split] || {};
                _.extend(ref[split], yamlConfig.readConfig(path.resolve(file)));
            } else if (file.indexOf('.ejs') !== -1) {
                var readFile = fs.readFileSync(path.resolve(file), {encoding: 'utf8'});
                ref[split] = ejs.compile(readFile);
            } else {
                ref[split] = require(path.resolve(file));
            }
        };

        _.each(files, function(name, file) {
            log.push(name);
            var splits = name.split('/');
            var ref = module;
            if (splits.length > 1) {
                _.each(splits, function(split, index) {
                    split = s.camelize(split);
                    if (index === splits.length - 1) {
                        splitRefFile(ref, split, file);
                    } else {
                        ref = ref[split] || (ref[split] = {});
                    }
                });
            } else {
                var split = s.camelize(name);
                splitRefFile(ref, split, file);
            }
        });
        console.log('loaded', moduleName, log);
    };

    var pathReduce = function(files) {
        var keys, common, file;

        if (Object.keys(files).length === 1) {
            file = Object.keys(files)[0];
            files[file] = path.basename(file);
            return files;
        }

        keys = [];
        for (var file in files) {
            keys.push(files[file].split('/'));
        }

        common = 0;
        while(keys.every(function(key) {
            return key[common] === keys[0][common];
        })) {
            common++;
        }
        common = keys[0].slice(0, common).join('/') + '/';

        for (var file in files) {
            files[file] = files[file].substring(common.length);
        }
        return files;
    };

    var stripExt = function(files) {
        var filenames = Object.keys(files);
        // contains map of stripped filenames
        var conflicts = {};
        for (var i=0, l=filenames.length; i<l; i++) {
            (function(file, key) {
                var newKey = key.substr(0, key.length - path.extname(key).length);
                // if already file with same stripping
                if (conflicts.hasOwnProperty(newKey)) {
                    // check if first conflict
                    if (conflicts[newKey] !== false) {
                        // revert previous file stripping
                        files[conflicts[newKey][0]] = conflicts[newKey][1];
                        conflicts[newKey] = false;
                    }
                } else {
                    // strip key
                    files[file] = newKey;
                    // remember for possible later conflicts
                    conflicts[newKey] = [file, key];
                }
            })(filenames[i], files[filenames[i]]);
        }
        return files;
    };

    $.load = function(baseDir) {
        baseDir = path.resolve(baseDir || (__dirname + '/../..'));

        console.log('LOADING ', baseDir);
        _.each(map, function(moduleName) {
            var files = glob.sync(baseDir+'/'+moduleName+'/**/*{.js,.yaml,.ejs}', {
                ignore: baseDir+'/'+moduleName+'/**/index.js'
            });

            if (!files.length) {
                return;
            }

            var mapped = _.reduce(files, function(hash, file) {
                hash[file] = file;
                return hash;
            }, {});
            //console.log('\nmapped = ', mapped);
            var pathReduced = pathReduce(mapped);
            //console.log('pathReduced = ', pathReduced);
            var strippedExt = stripExt(pathReduced);
            //console.log('strippedExt = ', strippedExt);
            mapRequire(moduleName, strippedExt);
        });

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