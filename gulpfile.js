// Импорт пакетов
const gulp = require('gulp')
const nodePath = require('path')
const fs = require('fs')
const replace = require('gulp-replace')
const plumber = require('gulp-plumber')
const notify = require("gulp-notify")
const sass = require('gulp-sass')(require('sass'))
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

// Получаем имя папки проекта (gulp_build)
const rootFolder = nodePath.basename(nodePath.resolve());

// Базовые пути к файлам
const basePath = {
  src: './_src',
  dev: './docs', 
  blocks: '_src/blocks',
  imgOpt: '_src/img',
}

// Пути к отдельным компонентам
const paths = {
  files: {
    src: basePath.src + '/files/**/*.*',
    dest: basePath.dev + '/files/',
    watch: basePath.src + '/files/**/*.*',
  },
  html: {
    src: [basePath.src + '/*.html', basePath.src + '/*.pug'],
    dest: basePath.dev,
    watch: 
      [basePath.src + '/*.html',
        // Чтобы watch не тормозил прописываем каждую папку отдельно
        // Ниже по коду добавим пути к файлам отдельными блоками
      ],
  },
  stylesScss: {
    src: basePath.src + '/styles/style.scss',
    dest: basePath.dev + '/css/',
    watch: 
    [basePath.src + '/styles/*.scss',
      // Чтобы watch не тормозил прописываем каждую папку отдельно
      // Ниже по коду добавим пути к файлам отдельными блоками
    ],
  },
  images: {
    src: basePath.blocks,
    dest: basePath.imgOpt,
    watch: [
      // Чтобы watch не тормозил прописываем каждую папку отдельно
      // Ниже по коду добавим пути к файлам отдельными блоками
    ],
  },
  imagesOpt: {
    src: basePath.imgOpt,
    dest: basePath.dev + '/img/',
    watch: [
      // Чтобы watch не тормозил прописываем каждую папку отдельно
      // Ниже по коду добавим пути к файлам отдельными блоками
    ],    
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

// Массив для списка папок блоков
const blocks = [];


// Получаем список блоков и записываем их в массив blocks
if (basePath.blocks) {
  fs.readdirSync(basePath.blocks).forEach(function (directory) {
      blocks.push(directory);
  });
}

// Добавляем к paths.html.watch пути к блокам
blocks.forEach (function (block) {
  paths.html.watch.push(basePath.blocks + '/' + block + '/*.html');
});

// Добавляем к paths.stylesScss.watch пути к блокам
blocks.forEach (function (block) {
  paths.stylesScss.watch.push(basePath.blocks + '/' + block + '/*.scss');
});

// Добавляем к paths.images.watch пути к блокам
blocks.forEach (function (block) {
  paths.images.watch.push(basePath.blocks + '/' + block + '/*.{jpg,jpeg,png}');
});

// Добавляем к paths.imagesOpt.watch пути к блокам
blocks.forEach (function (block) {
  paths.imagesOpt.watch.push(basePath.imgOpt + '/' + block + '/*.{jpg,jpeg,png}');
});

// Очистить каталог dist, удалить все кроме изображений и шрифтов
function clean() {
  return del(['dist/*', '!dist/img', '!dist/fonts'])
}

// Очистить каталог dist полностью
function reset() {
  return del(basePath.dev)
}

// Тестовая задача по копированию
function copy() {
  return gulp.src(paths.files.src)
   .pipe(gulp.dest(paths.files.dest))
}

// Обработка html и pug

function html() {
  return gulp.src(paths.html.src)
  // Уведомления об ошибках
  .pipe(plumber(
    notify.onError({
        title: "Ошибка HTML",
        message: "Error: <%= error.message %>"
    }))
  )
  .pipe(posthtml([
    include()
  ]))
  .pipe(replace('../', '/img/'))
  .pipe(htmlBeautify())
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей
function stylesScss() {
  return gulp.src(paths.stylesScss.src)
  .pipe(sourcemaps.init())
  .pipe(plumber(
    notify.onError({
        title: "Ошибка SCSS",
        message: "Error: <%= error.message %>"
    }))
  )
  // Преобразование в css
  .pipe(sass({
    outputStyle: 'expanded'
  }))

  .pipe(groupCssMediaQueries())

  // Подмена путей до изображений
  .pipe(replace('../', '../img/'))
  .pipe(replace('./src/fonts/', '../fonts/'))

  .pipe(autoprefixer(
    {
        grid: true,
        overrideBrowserlist: ["last 3 versions"],
        cascade: true
    }
  ))  
  .pipe(sourcemaps.write('.'))
  

  .pipe(gulp.dest(paths.stylesScss.dest))

  .pipe(cleanCSS({
    level: 2
  }))

  .pipe(rename({
    basename: 'style',
    suffix: '.min'
  }))  
  
  
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.stylesScss.dest))
  .pipe(browsersync.stream())
}

// Обработка Java Script, Type Script и Coffee Script
function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  //.pipe(coffee({bare: true}))
  /*
  .pipe(ts({
    noImplicitAny: true,
    outFile: 'main.min.js'
  }))
  */
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browsersync.stream())
}





// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {  
  browsersync.init({
    server: {
        baseDir: basePath.dev
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.files.watch, copy)
  gulp.watch(paths.html.watch, html)
  gulp.watch(paths.stylesScss.watch, stylesScss)
  gulp.watch(paths.scripts.src, scripts)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.reset = reset
exports.clean = clean
exports.copy = copy
exports.html = html
exports.styles = stylesScss
exports.scripts = scripts
exports.watch = watch

// Основные задачи
const mainTasks = gulp.parallel(stylesScss, scripts);

// Построение сценариев выполнения задач
const dev = gulp.series(clean, copy, html, mainTasks, watch);

// Таск, который выполняется по команде gulp
exports.default = dev;