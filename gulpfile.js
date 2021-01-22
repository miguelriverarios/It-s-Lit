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

const layouts = require('handlebars-layouts');
const rename = require('gulp-rename');
const data = require('gulp-data');
const hb = require('gulp-hb');

gulp.task('fonts', function () {
  return gulp.src(['node_modules/slick-carousel/slick/fonts/*', 'node_modules/@fortawesome/fontawesome-free/webfonts/*'])
    .pipe(gulp.dest('dist/fonts/webfonts/'));
});

gulp.task('images', function () {
  return gulp.src(['node_modules/slick-carousel/slick/ajax-loader.gif'])
    .pipe(gulp.dest('dist/images/'));
});

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
    .pipe(replace(/..\/webfonts/g, '../../fonts/webfonts'))
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

const hbStream = hb({ debug: true })
  // Partials
  .partials('./src/views/layouts/main.hbs')
  .partials('./src/views/partials/**/*.hbs')

  // Helpers
  .helpers('./src/util/handlebarsHelpers.js')
  .helpers(layouts)

const staticFiles = () => {
  return gulp
    .src('./src/views/?(events|index|reviews|trivia|who-we-are|your-results).hbs')
    .pipe(data((file) => {
      require('dotenv').config();
      try {
        return require(file.path.replace('views', 'controllers').replace('.hbs', '.js'))({ getDataOnly: true });
      } catch (err) {
        console.log(err);
      }
    }))
    .pipe(hbStream)
    .pipe(rename(function (path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./dist/pages'));
}

const runoffFile = (done) => {
  return gulp
    .src('./src/views/trivia.hbs')
    .pipe(data((file) => {
      require('dotenv').config();
      try {
        return require(file.path.replace('views', 'controllers').replace('.hbs', '.js'))({ getDataOnly: true, isRunoff: true });
      } catch (err) {
        console.log(err);
      }
    }))
    .pipe(hbStream)
    .pipe(rename(function (path) {
      path.basename = 'runoff';
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./dist/pages'));
}

gulp.task("staticPages", staticFiles);

gulp.task("runoffPage", runoffFile);

gulp.task('start', gulp.series('styles', 'javascripts', 'fonts', 'images', 'browser-sync'));