/**********************************************************
 * Wordpress gulp theme build
 * ********************************************************
 *
 * Gulp WP example theme by Eremenko Igor 17.6.2019 @MerelyiGor
 * Variable declaration
 * file paths for settings below
 * path to the parent directories of the finished theme and the folder with the source files,
 * customize according to your project
 *
 * ********************************************************
 * ********************************************************/
const root_dir_theme_name = 'myThemeName';                                                               // Theme folder name !!!
/**********************************************************
 * const root_dir_theme_name = your theme NAME!!!!
 * ********************************************************/
const root_dir = 'public/';                                                                                 // root folder with the finished project
const root_src_APP = 'src/';                                                                                // theme source folder
const root_src_sass = root_src_APP + 'sass/**/*.sass';                                                      // path to all sass files
const root_src_php = root_src_APP + 'theme-patch-php/**/**/*.php';                                          // path to all php files of pages
const root_src_js = root_src_APP + 'js/**/*.js';                                                            // path to all js files
const root_src_libs = root_src_APP + 'libs/**/*';                                                           // path to all library files
const root_src_image = root_src_APP + 'image/**/*';                                                         // path to all images
const root_src_screenshot = root_src_APP + 'screenshot/*';                                                  // Path to the subject meniature
const root_src_inc = root_src_APP + 'inc/**/*';                                                             // path to php theme library
const root_src_settings_style = root_src_APP + 'theme-settings/style.css';                                  // path to theme settings

const build_dir_css = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/css';                       // path to the folder ready css
const build_dir_php = root_dir + 'wp-content/themes/' + root_dir_theme_name;                                // path to the folder ready php
const build_dir_js = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/js';                         // ready js folder path
const build_dir_libs = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/libs';                     // path to the library folder
const build_dir_image = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/image';                   // path to the folder of finished images
const build_dir_screenshot = root_dir + 'wp-content/themes/' + root_dir_theme_name;                         // path to the folder with the theme thumbnail
const build_dir_inc = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/inc';                       // php theme library path
const build_dir_settings_style = root_dir + 'wp-content/themes/' + root_dir_theme_name;                     // path to the theme folder for settings

/***************----------------------------------------------------------------**************
 * Settings upload to server
 * FTP UPLOAD COMAND "$ gulp deploy"
 ***************----------------------------------------------------------------**************/
const ftp_host = 'host';
const ftp_user = 'user';
const ftp_password = 'password';
const local_directory_src = root_dir + 'wp-content/themes/' + root_dir_theme_name + '/**';       // path from where to get files to upload
const FTP_directory_deploy = '/sub/domain.com/to/server/directory';                              // path to upload folders on the server
/***************----------------------------------------------------------------**************/

// We connect Gulp and all necessary libraries
const gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    ftp = require('vinyl-ftp'),
    del = require('del');


// scissors and paste main.css
function sassBuild(done) {
    return gulp.src(root_src_sass)
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(cleanCSS())
        .pipe(gulp.dest(build_dir_css));
    done();
}

// delete files on demand - (cash and so on)
function clean(done) {
    return del([root_dir + 'wp-content/themes/' + root_dir_theme_name + '/**', '!' + root_dir + '/wp-content/themes/' + root_dir_theme_name]);
    done();
}

// assembly php
function phpBuild(done) {
    gulp.src(root_src_php)
        .pipe(gulp.dest(build_dir_php));
    done();
}

// assembly js
function jsBuild(done) {
    gulp.src(root_src_js)
        .pipe(gulp.dest(build_dir_js));
    done();
}

// library relocation
function libsBuild(done) {
    gulp.src(root_src_libs)
        .pipe(gulp.dest(build_dir_libs));
    done();
}

// moving images
function imageBuild(done) {
    gulp.src(root_src_image)
        .pipe(gulp.dest(build_dir_image));
    done();
}

// moving theme screenshot
function screenBuild(done) {
    gulp.src(root_src_screenshot)
        .pipe(gulp.dest(build_dir_screenshot));
    done();
}

// moving php theme libraries
function phpLibsBuild(done) {
    gulp.src(root_src_inc)
        .pipe(gulp.dest(build_dir_inc));
    done();
}


// moving theme settings file style.css
function settingsBuild(done) {
    gulp.src(root_src_settings_style)
        .pipe(gulp.dest(build_dir_settings_style));
    done();
}


function watchFiles() {
    gulp.watch(root_src_sass, gulp.series(sassBuild));
    gulp.watch(root_src_php, gulp.series(phpBuild));
    gulp.watch(root_src_js, gulp.series(jsBuild));
    gulp.watch(root_src_libs, gulp.series(libsBuild));
    gulp.watch(root_src_image, gulp.series(imageBuild));
    gulp.watch(root_src_screenshot, gulp.series(screenBuild));
    gulp.watch(root_src_inc, gulp.series(phpLibsBuild));
    gulp.watch(root_src_settings_style, gulp.series(settingsBuild));
}

// Uploading changes to hosting
gulp.task('deploy', function () {
    const conn = ftp.create({
        host: ftp_host,
        user: ftp_user,
        password: ftp_password,
        parallel: 10,
        log: gutil.log
    });
    const globs = [local_directory_src];
    return gulp.src(globs, {base: '.', buffer: false})
        .pipe(conn.newer(FTP_directory_deploy))
        .pipe(conn.dest(FTP_directory_deploy));
});

gulp.task('build', gulp.series(clean, gulp.parallel(
    sassBuild,
    phpBuild,
    jsBuild,
    libsBuild,
    imageBuild,
    screenBuild,
    phpLibsBuild,
    settingsBuild
)));

gulp.task('default', gulp.series(watchFiles));
