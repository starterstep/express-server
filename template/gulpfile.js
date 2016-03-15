var gulp = require('gulp');
var mocha = require('gulp-mocha');
var argv = require('yargs').argv;

gulp.task('mocha', function () {
    require('./test');

    var test = './tests/';
    test += argv.test && argv.test || '**/*test.js';
    gulp.src(test).pipe(mocha({
        "reporter": "spec",
        timeout:120000
    })).once('error', function (err) {
        console.error(err);
        process.exit(1);
    }).once('end', function () {
        process.exit();
    });
});

gulp.task('test', ['mocha']);