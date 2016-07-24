var gulp = require('gulp');
var util = require('gulp-util');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require("gulp-tslint");
var uglify = require('gulp-uglifyjs');
var zip = require('gulp-zip');
var del = require('del');
var gulpCopy = require('gulp-copy');
var gulpsync = require('gulp-sync')(gulp);

var packageJSON = require('./package.json');

//ts
var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });

gulp.task('test', function () {
    return gulp.src('test/*.js')
        .pipe(mocha())
        .on('error', util.log)
        .once('error', function () {
            process.exit(1);
        });
});


gulp.task('compile', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));


    return tsResult.js
        .pipe(gulp.dest('src'));
});


gulp.task("lint",  function () {
    return tsProject.src()
        .pipe(tslint({
            formatter: "prose",
            configuration: "tslint.json"
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true,
            emitError: false
        }));
});

gulp.task('watch', function() {
    gulp.watch(['src/*.ts', 'tsconfig.json'], ['compile']);
});


gulp.task('minify' ,function () {
    return gulp.src(['src/*.js'])
        .pipe(uglify('BareJS.min.js', {
            outSourceMap: true,
            basePath: 'dist/js',
            compress: {
                hoist_vars: true
            },
            output: {
                source_map: true
            }
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('clean', function (cb) {
    return del([
        'dist/**/*',
        'dist'
    ], cb);
});

gulp.task('copy', function () {
    return gulp.src('src/*.js')
        .pipe(gulpCopy('dist/js', {prefix: 1}));
});

gulp.task('zip', function () {
    return gulp
        .src('dist/js/*')
        .pipe(zip(packageJSON.name + '-'+packageJSON.version+'.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('release', function () {
    return gulp.start.apply(gulp, gulpsync.sync(['compile', 'test', 'clean', 'copy', 'minify', 'zip']));
});
