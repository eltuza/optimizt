'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),
    sourceFile = './app/scripts/app.js',
    destFolder = './dist/scripts',
    destFileName = 'app.js';

var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Styles
gulp.task('styles', [ 'moveCss' ]);

gulp.task('moveCss',['clean'], function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/styles/**/*.css'], { base: './app/styles/' })
    .pipe(gulp.dest('dist/styles'));
});

var bundler = watchify(browserify({
    entries: [sourceFile],
    debug: true,
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
}));

bundler.on('update', rebundle);
bundler.on('log', $.util.log);

function rebundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source(destFileName))
        .pipe(gulp.dest(destFolder))
        .on('end', function() {
            reload();
        });
}

// Scripts
gulp.task('scripts', rebundle);

gulp.task('buildScripts', function() {
    return browserify(sourceFile)
        .bundle()
        .pipe(source(destFileName))
        .pipe(gulp.dest('dist/scripts'));
});

// HTML
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function(cb) {
    $.cache.clearAll();
    cb(del.sync(['dist/styles', 'dist/scripts', 'dist/images']));
});

// Bundle
gulp.task('bundle', ['styles', 'scripts'], function() {
    return gulp.src('./app/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('buildBundle', ['styles', 'buildScripts', 'moveLibraries'], function() {
    return gulp.src('./app/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

// Move JS Files and Libraries
gulp.task('moveLibraries',['clean'], function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/scripts/**/*.js'], { base: './app/scripts/' })
  .pipe(gulp.dest('dist/scripts'));
});

// Watch
gulp.task('watch', ['html', 'bundle'], function() {

    browserSync({
        notify: false,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['dist', 'app']
    });

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    gulp.watch(['app/styles/**/*.scss', 'app/styles/**/*.css'], ['styles', 'scripts', reload]);

    // Watch image files
    gulp.watch('app/images/**/*', reload);
});

// Build
gulp.task('build', ['html', 'buildBundle'], function() {
    gulp.src('dist/scripts/app.js')
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe(gulp.dest('dist/scripts'));
});

// Default task
gulp.task('default', ['clean', 'build']);
