// Импорт пакетов
const gulp = require('gulp')
const nodePath = require('path')
const fs = require('fs')
const replace = require('gulp-replace')
const plumber = require('gulp-plumber')
const notify = require("gulp-notify")
const dartSass = require('sass');
const sass = require('gulp-dart-sass');
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const groupCssMediaQueries = require('gulp-group-css-media-queries')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const size = require('gulp-size')
const browsersync = require('browser-sync').create()
const del = require('del')
const posthtml = require('gulp-posthtml')
const include = require('posthtml-include')
const htmlBeautify = require('gulp-html-beautify')
const newer = require('gulp-newer')

// Имя папки проекта
const rootFolder = nodePath.basename(nodePath.resolve());

// Базовые пути к файлам
const basePath = {
  src: './_src',
  dev: './docs',
  blocks: '_src/blocks',
  imgOpt: '_src/img',
}

// Пути к файлам
const paths = {
  files: {
    src: basePath.src + '/files/**/*.*',
    dest: basePath.dev + '/files/',
    watch: basePath.src + '/files/**/*.*',
  },
  html: {
    src: [basePath.src + '/*.html', basePath.src + '/*.pug'],
    dest: basePath.dev,
    watch: [],
  },
  stylesScss: {
    src: basePath.src + '/styles/style.scss',
    dest: basePath.dev + '/css/',
    watch: [],
  },
  images: {
    src: basePath.blocks,
    dest: basePath.imgOpt,
    watch: [],
  },
  imagesOpt: {
    src: basePath.imgOpt,
    dest: basePath.dev + '/img/',
    watch: [],
  },
  svgicons: {
    src: basePath.imgOpt + '/icons/icon-*.svg',
    dest: basePath.blocks + '/icons/',
    watch: basePath.imgOpt + '/icons/icon-*.svg',
  },
  fonts: {
    src: basePath.src + '/styles/fonts-original/',
    dest: basePath.src + '/fonts/',
  },
  scripts: {
    src: ['_src/scripts/**/*.coffee', '_src/scripts/**/*.ts', '_src/scripts/**/*.js'],
    dest: 'docs/js/'
  },
}

// Массив блоков
const blocks = []

if (basePath.blocks) {
  fs.readdirSync(basePath.blocks).forEach(function (directory) {
    blocks.push(directory)
  })
}

// Watch пути по блокам
blocks.forEach(function (block) {
  paths.html.watch.push(basePath.blocks + '/' + block + '/*.html')
  paths.stylesScss.watch.push(basePath.blocks + '/' + block + '/*.scss')
  paths.images.watch.push(basePath.blocks + '/' + block + '/*.{jpg,jpeg,png}')
  paths.imagesOpt.watch.push(basePath.imgOpt + '/' + block + '/*.{jpg,jpeg,png}')
})

// HTML
function html() {
  return gulp.src(paths.html.src)
    .pipe(plumber(notify.onError({ title: "Ошибка HTML", message: "Error: <%= error.message %>" })))
    .pipe(posthtml([include()]))
    .pipe(replace('../', '/img/'))
    .pipe(htmlBeautify())
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}

// SCSS → CSS
function stylesScss() {
  return gulp.src(paths.stylesScss.src)
    .pipe(plumber(notify.onError({ title: "Ошибка SCSS", message: "Error: <%= error.message %>" })))
    .pipe(sass({ outputStyle: 'expanded', implementation: dartSass }))
    .pipe(groupCssMediaQueries())
    .pipe(replace('../', '../img/'))
    .pipe(replace('./src/fonts/', '../fonts/'))
    .pipe(autoprefixer({ grid: true, overrideBrowserslist: ["last 3 versions"], cascade: true }))
    .pipe(gulp.dest(paths.stylesScss.dest))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename({ basename: 'style', suffix: '.min' }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.stylesScss.dest))
    .pipe(browsersync.stream())
}



// JS (копируем + минифицируем)
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(newer(paths.scripts.dest))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}


// Копирование картинок
function imagesCopy() {
  return gulp.src(paths.imagesOpt.src + '/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(newer(paths.imagesOpt.dest))
    .pipe(gulp.dest(paths.imagesOpt.dest))
}

// Копирование прочих файлов
function copy() {
  return gulp.src(paths.files.src)
    .pipe(newer(paths.files.dest))
    .pipe(gulp.dest(paths.files.dest))
}

// Watch + сервер
function watch() {
  browsersync.init({ server: { baseDir: basePath.dev } })
  gulp.watch(paths.files.watch, copy)
  gulp.watch(paths.html.watch, html)
  gulp.watch(paths.stylesScss.watch, stylesScss)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.watch, imagesCopy)
}

// Экспорты
exports.html = html
exports.styles = stylesScss
exports.scripts = scripts
exports.imagesCopy = imagesCopy
exports.copy = copy
exports.watch = watch

// Основные задачи
const mainTasks = gulp.parallel(stylesScss, scripts, imagesCopy, copy)

// Сценарии
const dev = gulp.series(copy, html, mainTasks, watch)
exports.default = dev
