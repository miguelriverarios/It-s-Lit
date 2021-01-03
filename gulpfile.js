const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const prefix = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const nodemon = require('gulp-nodemon');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const config = require('./webpack.config');
const merge = require('merge-stream');

gulp.task('styles', function () {
  const plugins = [
    autoprefixer(),
    cssnano()
  ];
  const scssStream = gulp.src('./src/ui/stylesheets/*.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: 'map',
      includePaths: ['node_modules']
    },
      { errLogToConsole: true }))
    .pipe(concat('scss-files.css'))
    .pipe(gulp.dest('src/ui/concat/'));

    const cssStream = gulp.src('./src/ui/stylesheets/vendors/*.css')
    .pipe(concat('css-files.css'))
    .pipe(gulp.dest('src/ui/concat/'));

  return merge(scssStream, cssStream)
    .pipe(postcss(plugins))
    .pipe(prefix("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/stylesheets/'))
    .pipe(reload({ stream: true }));
});


gulp.task('javascripts', function () {
  return gulp.src(['./src/ui/javascripts/*.js'])
    .pipe(webpackStream(config, webpack))
    // .pipe(concat('js-files.js'))
    // .pipe(gulp.dest('src/ui/concat/'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/javascripts/'))
    .pipe(reload({ stream: true }));
});

gulp.task('nodemon', function (cb) {
  let called = false;
  return nodemon({ script: 'src/bin/www' }).on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  });
});

gulp.task('browser-sync', gulp.series('nodemon', function (done) {
  browserSync.init(null, {
    proxy: "http://localhost:5000"
  });

  gulp.watch("src/ui/stylesheets/**/*.scss", gulp.series('styles'));
  gulp.watch("src/ui/javascripts/**/*.js", gulp.series('javascripts'));
  gulp.watch("src/views/**/*.hbs", function (done) {
    reload();
    done();
  });
  done();
}));

gulp.task('start', gulp.series('styles', 'javascripts', 'browser-sync'));