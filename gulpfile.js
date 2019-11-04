var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var cssmin = require('gulp-cssmin');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pump = require('pump');

var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var clean = require('gulp-clean');
var gulpsync = require('gulp-sync')(gulp);

//--server--//
gulp.task('server', function() {
	gulp.src('')
		.pipe(server({
			livereload: true,
			open: true
		}));
});

//--compiler--//
gulp.task('sass', function () {

	return gulp.src('app/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix({
            browsers:['last 3 versions']
		}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('watch', function () {
	gulp.watch('app/sass/*.scss', ['sass']);
});

gulp.task('default', ['browser-sync','watch']);

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		},
    notify: false
	});
});


gulp.task('min-js', function (cb) {
  pump([
      gulp.src(['app/js/**/*.js','!app/js/**/*.min.js']),
      babel({
        presets: ['@babel/env']
      }),
      uglify(),
      rename({suffix: '.min'}),
      gulp.dest('build/js')
    ],
    cb
  );
});

gulp.task('min-css', function () {
  gulp.src('app/css/*.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'));
});

gulp.task('transfer-font', function () {
  gulp.src('app/fonts/*.*')
    .pipe(gulp.dest('build/fonts'));
});
gulp.task('transfer-img', function () {
  gulp.src('app/img/*.*')
    .pipe(gulp.dest('build/img'));
});

gulp.task('transfer-min', function () {
  gulp.src('app/**/*.min.*')
    .pipe(gulp.dest('build/'));
});

gulp.task('clean', function () {
  gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('compile', gulpsync.sync(['clean','min-js','min-css','transfer-font','transfer-img']));