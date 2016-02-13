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

            var data = {};
            if (fs.existsSync(path)) {
                var files = fs.readdirSync(path);
                _.each(files, function(file) {
                    if (file.indexOf('.ejs') !== -1) {
                        var fullPath = path + '/' + file;
                        var name = file.split('.ejs')[0];
                        if (include && include.indexOf(name) === -1) {
                            return;
                        }
                        if (exclude && exclude.indexOf(name) !== -1) {
                            return;
                        }
                        var readFile = fs.readFileSync(fullPath, {encoding:'utf8'});
                        data[s.camelize(name)] = ejs.compile(readFile);
                    }
                });
            }
            return data;
        }
    };
};