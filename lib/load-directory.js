var fs = require('fs');
var _ = require('underscore');
var s = require('underscore.string');

module.exports = function(context) {
    return {
        load: function(options) {
            var path = options.path;
            var include = options.include;
            var exclude = options.exclude;
            var object = options.object;

            if (fs.existsSync(path)) {
                if (include && include.length) {
                    _.each(include, function(name) {
                        var fullPath = path + '/' + name + '.js';
                        if (fs.existsSync(fullPath)) {
                            object[s.camelize(name)] = require(fullPath);
                        }
                    });
                } else {
                    var files = fs.readdirSync(path);
                    _.each(files, function(file) {
                        if (file.indexOf('.js') !== -1) {
                            var fullPath = path + '/' + file;
                            var name = file.split('.js')[0];
                            if (exclude && exclude.indexOf(name) !== -1) {
                                return;
                            }
                            object[s.camelize(name)] = require(fullPath);
                        }
                    });
                }
            }
        }
    };
};