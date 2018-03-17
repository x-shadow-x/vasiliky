var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    // connectConnect = require('gulp-connect'),
    webserver = require('gulp-webserver');

/**
 * 编译sass，添加css属性前缀，对样式表进行压缩
 */
gulp.task('styles', function() {
    return gulp.src('../src/sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('../dist/css/'));
    // .pipe(notify({message: 'styles task has completed'}));
});

/**
 * js代码校验，压缩
 */
gulp.task('scripts', function() {
    //js代码校验
    return gulp.src('../src/js/**/*.js')
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    //给文件添加.min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩脚本文件
    .pipe(uglify({
      mangle: false
    }))
    //输出压缩文件到指定目录
    .pipe(gulp.dest('../dist/js/'));
    //提醒任务完成
    // .pipe(notify({ message: 'Scripts task complete' }));
});

/**
 * 图片压缩
 */
gulp.task('images', function() {
  return gulp.src('../src/images/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('../dist/images/'));
    // .pipe(notify({ message: 'Images task complete' }));
});

/**
 * 监听文件的修改
 */
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('../src/sass/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('../src/js/**/*.js', ['scripts']);
  // Watch image files
  gulp.watch('../src/images/*', ['images']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in assets/, reload on change
  gulp.watch(['../dist/**/*', '../*.html']).on('change', livereload.changed);
});

gulp.task('webserver', function() {
  gulp.src('../../vasiliky')
    .pipe(webserver({
      livereload: {enable:true},
      open: true
    }));
});

gulp.task('default', function() {
    gulp.start('watch', 'styles', 'scripts', 'images', 'webserver');
});