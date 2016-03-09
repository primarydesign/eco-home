var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack-stream');
var postcss = require('gulp-postcss');
var imagemin = require('gulp-imagemin');
var named = require('vinyl-named');
var htmlmin = require('gulp-htmlmin');
var browsersync = require('browser-sync');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');
var animation = require('postcss-animation');

var Browser = browsersync.create();
var wpconfig = require('./webpack.config.js');
var $ = require('./config.json');
var cssparts = [precss(), animation(), autoprefixer(), cssnano()];

gulp.task('pages', function() {
	return gulp.src($.pages.src)
	.pipe(htmlmin({
		removeComments: true,
		collapseWhitespace: true,
		removeTagWhitespace: true,
		removeRedundantAttributes: true,
		minifyJS: true,
		minifyCSS: true,
		minifyURLs: true,
		quoteCharacter: "\""
	}))
	.pipe(gulp.dest($.pages.dest))
	.pipe(Browser.stream());
});
gulp.task('styles', function() {
	return gulp.src($.styles.src)
	.pipe(postcss(cssparts))
	.on('error', gutil.log)
	.pipe(gulp.dest($.styles.dest))
	.pipe(Browser.stream());
});
gulp.task('scripts', function() {
	return gulp.src($.scripts.src)
	.pipe(named())
	.pipe(webpack(wpconfig))
	.pipe(gulp.dest($.scripts.dest))
	.pipe(Browser.stream());
});
gulp.task('images', function() {
	return gulp.src($.images.src)
	.pipe(imagemin())
	.pipe(gulp.dest($.images.dest))
	.pipe(Browser.stream());
});
gulp.task('watch', function() {
	gulp.watch($.pages.src, ['pages']);
	gulp.watch($.styles.watch, ['styles']);
	gulp.watch($.scripts.watch, ['scripts']);
});
gulp.task('serve', function() {
	Browser.init({
		open: true,
		ghostMode: false,
		notify: false,
		server: { baseDir: $.app }
	});
});
gulp.task('default', ['pages','styles','scripts','images','serve','watch']);