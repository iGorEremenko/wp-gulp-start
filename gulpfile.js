/**********************************************************
 * Wordpress gulp theme build
 * ********************************************************
 *
 * Gulp by Eremenko Igor 11.62019 @MerelyiGor
 * Обьявление переменных
 * пути к файлам
 * путь к родителю директорий
 *
 * ********************************************************
 * ********************************************************/
const root_dir_theme_name = 'misskiss-theme';                                                               // Название папки темы
const root_dir = 'root_dir/';                                                                               // папка корня с готовым проектом
const root_src_APP = 'src/';                                                                                // папка с исходними файлами темы
const root_src_sass = root_src_APP + 'sass/**/*.sass';                                                      // путь ко всем sass файлам
const root_src_php = root_src_APP + 'theme-patch-php/**/**/*.php';                                          // путь ко всем php файлам страниц
const root_src_js = root_src_APP + 'js/**/*.js';                                                            // путь ко всем js файлам
const root_src_libs = root_src_APP + 'libs/**/*';                                                           // путь ко всем файлам библиотек
const root_src_image = root_src_APP + 'image/**/*';                                                         // путь ко всем изображениям
const root_src_screenshot = root_src_APP + 'screenshot/*';                                                  // путь к изходнику мениатюры темы
const root_src_inc = root_src_APP + 'inc/**/*';                                                             // путь к изходнику php библиотек темы
const root_src_settings_style = root_src_APP + 'theme-settings/style.css';                                  // путь к изходнику настроек темы

const build_dir_css = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/css';                       // путь в папку готового css
const build_dir_php = root_dir + 'wp-content/themes/' + root_dir_theme_name;                                // путь в папку готовых php
const build_dir_js = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/js';                         // путь в папку готовых js
const build_dir_libs = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/libs';                     // путь в папку библиотек
const build_dir_image = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/image';                   // путь в папку готовых изображений
const build_dir_screenshot = root_dir + 'wp-content/themes/' + root_dir_theme_name;                         // путь в папку с миниатюрой темы
const build_dir_inc = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/inc';                       // путь php библиотек темы
const build_dir_settings_style = root_dir + 'wp-content/themes/' + root_dir_theme_name;                     // путь в папку корня темы для настроек

/***************----------------------------------------------------------------**************
 * Настройки выгрузки на сервер
 * FTP UPLOAD COMAND "$ gulp deploy"
 ***************----------------------------------------------------------------**************/
const ftp_host = 'host';
const ftp_user = 'user';
const ftp_password = 'password';
const local_directory_src = root_dir + 'wp-content/themes/' + root_dir_theme_name;                          //путь от куда брать файлы для выгрузки
const FTP_directory_deploy = root_dir + '/sub/domain.com/to/server/directory';                              //путь куда загружать папки на сервере
/***************----------------------------------------------------------------**************/

// Подключаем Gulp и все необходимые библиотеки
const gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    ftp = require('vinyl-ftp'),
    del = require('del');


// Компиляция main.css
gulp.task('sass', function () {
    return gulp.src(root_src_sass)
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(cleanCSS())
        .pipe(gulp.dest(build_dir_css));
});

// удаление файлов по требованию - (кеш и тд)
gulp.task('clean', function () {
    return del(['root_dir/system/storage/cache/*', '!root_dir/system/storage/cache']);
});

// Сборка php
gulp.task('php:build', function () {
    gulp.src(root_src_php)
        .pipe(gulp.dest(build_dir_php))
});

// Сборка js
gulp.task('js:build', function () {
    gulp.src(root_src_js)
        .pipe(gulp.dest(build_dir_js))
});

// перемещение библиотек
gulp.task('libs:build', function () {
    gulp.src(root_src_libs)
        .pipe(gulp.dest(build_dir_libs))
});

// перемещение изображений
gulp.task('image:build', function () {
    gulp.src(root_src_image)
        .pipe(gulp.dest(build_dir_image))
});

// перемещение скриншота темы
gulp.task('screen:build', function () {
    gulp.src(root_src_screenshot)
        .pipe(gulp.dest(build_dir_screenshot))
});

// перемещение php библиотек темы
gulp.task('php-libs:build', function () {
    gulp.src(root_src_inc)
        .pipe(gulp.dest(build_dir_inc))
});


// перемещение файла настроек темы style.css
gulp.task('settings:build', function () {
    gulp.src(root_src_settings_style)
        .pipe(gulp.dest(build_dir_settings_style))
});

// Наблюдение за файлами
gulp.task('watch', ['sass'], function () {
    gulp.watch(root_src_sass, ['sass']);
    gulp.watch(root_src_php, ['php:build']);
    gulp.watch(root_src_js, ['js:build']);
    gulp.watch(root_src_libs, ['libs:build']);
    gulp.watch(root_src_image, ['image:build']);
    gulp.watch(root_src_screenshot, ['screen:build']);
    gulp.watch(root_src_inc, ['php-libs:build']);
    gulp.watch(root_src_settings_style, ['settings:build']);
});

// Выгрузка изменений на хостинг
gulp.task('deploy', function () {
    const conn = ftp.create({
        host: ftp_host,
        user: ftp_user,
        password: ftp_password,
        parallel: 10,
        log: gutil.log
    });
    const globs = [local_directory_src];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest(FTP_directory_deploy));
});

gulp.task('build', ['sass',
    'php:build',
    'js:build',
    'libs:build',
    'image:build',
    'screen:build',
    'php-libs:build',
    'settings:build'
]);

gulp.task('default', ['watch']);
