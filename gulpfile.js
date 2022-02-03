const { src, dest, watch, parallel, series }  = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const browserSync   = require('browser-sync').create();
//const fs            = require('fs');
const fonter        = require('gulp-fonter');
const ttf2woff2     = require('gulp-ttf2woff2');
const fileinclude   = require('gulp-file-include');

function browsersync() {
  browserSync.init ({
    server: {
      baseDir: 'app/'
    },
    notify: false
  })
}

function styles() {
  return src('app/scss/style.scss')
  //.pipe(scss({ outputStyle: 'compressed' }))
  .pipe(scss({ outputStyle: 'expanded' }))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist:['last 10 versions'],
    grid: true
  }))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/mixitup/dist/mixitup.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function images() {
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({ interlaced: true }),
    imagemin.mozjpeg({ quality: 75, progressive: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({
      plugins: [
        { removeViewBox: true },
        { cleanupIDs: false }
      ]
    })
  ]))
  .pipe(dest('dist/images'))
}
/*
function otfToTtf() {
  return src('app/fonts/*.otf')
  .pipe(plumber(onError({
    title: "FONTS",
    message: "Error: <%= error.message %>"
  })))
  .pipe(fonter({
    formats: ['ttf']
  }))
  .pipe(dest('app/fonts/'))
}
*/
function ttfToWoff() {
  return src('app/fonts/*.ttf')
/*    .pipe(plumber(onError({
      title: "FONTS",
      message: "Error: <%= error.message %>"
    })))
*/
    .pipe(fonter({
      formats: ['woff']
    }))
    .pipe(dest('app/fonts/'))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts/'))
}

function fileInclude() {
  return src(['app/html/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    })) 
    .pipe(dest('app'));
}

function build() {
  return src([
    'app/fonts/*.woff',
    'app/fonts/*.woff2',
    'app/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['app/fonts/*.ttf', '!app/fonts/*.woff', '!app/fonts/*.woff2'], ttfToWoff);
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', fileInclude);
  watch(['app/**/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
//exports.otfToTtf = otfToTtf;
exports.ttfToWoff = ttfToWoff;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, ttfToWoff, build);

exports.default = parallel(styles, scripts, browsersync, watching)