var fs = require('fs');
var yamlConfig = require('yaml-config');
var _ = require('underscore');
var s = require('underscore.string');

module.exports = function() {
    return {
        load: function(options) {
            var path = options.path;
            var include = options.include;
            var exclude = options.exclude;
            var object = options.object;

            if (fs.existsSync(path)) {
                if (include && include.length) {
                    _.each(include, function(name) {
                        var fullPath = path + '/' + name + '.yaml';
                        if (fs.existsSync(fullPath)) {
                            object[s.camelize(name)] = object[s.camelize(name)] || {};
                            _.extend(object[s.camelize(name)], yamlConfig.readConfig(fullPath));
                        }
                    });
                } else {
                    var files = fs.readdirSync(path);
                    _.each(files, function(file) {
                        if (file.indexOf('.yaml') !== -1) {
                            var fullPath = path + '/' + file;
                            var name = file.split('.yaml')[0];
                            if (exclude && exclude.indexOf(name) !== -1) {
                                return;
                            }
                            object[s.camelize(name)] = object[s.camelize(name)] || {};
                            _.extend(object[s.camelize(name)], yamlConfig.readConfig(fullPath));
                        }
                    });
                }
            }
        }
    };
};