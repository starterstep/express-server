var fs = require('fs');
var _ = require('underscore');
var s = require('underscore.string');
var ejs = require('ejs');

module.exports = function() {
    return {
        compile: function(options) {
            var path = options.path;
            var include = options.include;
            var exclude = options.exclude;
            var object = options.object;

            if (fs.existsSync(path)) {
                if (include && include.length) {
                    _.each(include, function(name) {
                        var fullPath = path + '/' + name + '.ejs';
                        if (fs.existsSync(fullPath)) {
                            var readFile = fs.readFileSync(fullPath, {encoding: 'utf8'});
                            object[s.camelize(name)] = ejs.compile(readFile);
                        }
                    });
                } else {
                    var files = fs.readdirSync(path);
                    _.each(files, function(file) {
                        if (file.indexOf('.ejs') !== -1) {
                            var fullPath = path + '/' + file;
                            var name = file.split('.ejs')[0];
                            if (exclude && exclude.indexOf(name) !== -1) {
                                return;
                            }
                            var readFile = fs.readFileSync(fullPath, {encoding: 'utf8'});
                            object[s.camelize(name)] = ejs.compile(readFile);
                        }
                    });
                }
            }
        }
    };
};