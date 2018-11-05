//initialize all of our variables
var app, base, concat, directory, gulp, gutil, hostname, path, refresh, sass, minify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, del, sourceMaps, plumber;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp = require('gulp');
gutil = require('gulp-util');
concat = require('gulp-concat');
minify = require('gulp-minify');
sass = require('gulp-sass');
sourceMaps = require('gulp-sourcemaps');
imagemin = require('gulp-imagemin');
minifyCSS = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell = require('gulp-shell');
del = require('del');
plumber = require('gulp-plumber');

var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var es = require('event-stream');
var fs = require('fs');

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: "app/",
            index: "index_en.html"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});


//compressing images & handle SVG files
gulp.task('images', function (tmp) {
    gulp.src(['app/images/*.jpg', 'app/images/*.png'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('app/images'));
});

//compressing images & handle SVG files
gulp.task('images-deploy', function () {
    gulp.src(['app/images/**/*', '!app/images/README'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});

//compiling our Javascripts
gulp.task('scripts', function () {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        //this is the filename of the compressed version of our JS
        .pipe(concat('app.js'))
        //catch errors
        .on('error', gutil.log)
        //where we will store our finalized, compressed script
        .pipe(gulp.dest('app/scripts'))
        //notify browserSync to refresh
        .pipe(browserSync.reload({
            stream: true
        }));
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function () {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        //this is the filename of the compressed version of our JS
        .pipe(concat('app.js'))
        //compress :D
        .pipe(minify())
        //where we will store our finalized, compressed script
        .pipe(gulp.dest('dist/scripts'));
});

//compiling our SCSS files
gulp.task('styles', function () {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/scss/init.scss')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        //get sourceMaps ready
        .pipe(sourceMaps.init())
        //include SCSS and list every "include" folder
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [
                'app/styles/scss/',
                'node_modules'
            ]
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        //catch errors
        .on('error', gutil.log)
        //the final filename of our combined css file
        .pipe(concat('styles.css'))
        //get our sources via sourceMaps
        .pipe(sourceMaps.write())
        //where to save our final, compressed css file
        .pipe(gulp.dest('app/styles'))
        //notify browserSync to refresh
        .pipe(browserSync.reload({
            stream: true
        }));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function () {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/scss/init.scss')
        .pipe(plumber())
        //include SCSS includes folder
        .pipe(sass({
            includePaths: [
                'app/styles/scss',
            ]
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        //the final filename of our combined css file
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        //where to save our final, compressed css file
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('handlebars', function () {

    var templateData = {
        en: JSON.parse(fs.readFileSync('./en.json')),
        de: JSON.parse(fs.readFileSync('./de.json'))
    };

    var options = {
        ignorePartials: true,
        batch: ['./app/partials'],
        helpers: {
            if_eq: function (a, b, opts) {
                if (a == b) {
                    return opts.fn(this);
                } else {
                    return opts.inverse(this);
                }
            },
            lang_switcher_text: function (lang) {
                if (lang === 'en') {
                    return 'DE';
                } else {
                    return 'EN';
                }
            },
            lang_switcher_link: function (lang) {
                if (lang === 'en') {
                    return '/de';
                } else {
                    return '/en';
                }
            },
            delay_item_on_index: function (value) {
                if (parseInt(value, 10) % 2 === 0) {
                    return '' + 200;
                } else {
                    return '' + 400;
                }
            },
            sentence_with_email_link: function (string, link) {
                var splitSentence = string.split('(__link__)');
                return '' + splitSentence[0] + link + splitSentence[1];
            },
            if_cond: function (v1, operator, v2, options) {
                switch (operator) {
                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (v1 != v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },
            stack_delay_on_index: function (value) {
                var number = parseInt(value, 10);
                return number === 0 ? 100 : (number * 100);
            },
        }
    }


    var en = gulp.src('app/index.hbs')
        .pipe(plumber())
        .pipe(handlebars(templateData.en, { ...options,
            partials: {
                lang: 'en'
            }
        }))
        .pipe(rename({
            basename: 'index',
            suffix: '_en',
            extname: '.html'
        }))
        .pipe(gulp.dest('app'));

    var de = gulp.src('app/index.hbs')
        .pipe(handlebars(templateData.de, { ...options,
            partials: {
                lang: 'de'
            }
        }))
        .pipe(rename({
            basename: 'index',
            suffix: '_de',
            extname: '.html'
        }))
        .pipe(gulp.dest('app'));

    return es.concat(en, de);
});

//basically just keeping an eye on all HTML files
gulp.task('html', ['handlebars'], function () {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('app/**/*.hbs')
        .pipe(plumber())
        .pipe(browserSync.reload({
            stream: true
        }))
        //catch errors
        .on('error', gutil.log);
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', ['handlebars'], function () {
    //grab everything, which should include robots, etc
    gulp.src(['app/*.html', 'app/favicon.png'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    //grab any hidden files too
    gulp.src('app/.*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'));

    //grab all of the styles
    gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/styles'));
});

//cleans our dist directory in case things got deleted
gulp.task('clean-dist', function () {
    return del([
        'dist/*'
    ]);
});

//cleans in case things got deleted
gulp.task('clean', ['clean-dist'], function () {
    return del([
        'app/scripts/*.js',
        'app/styles/*.css',
        'app/index_*.html'
    ]);
});

//create folders using shell
gulp.task('scaffold', function () {
    return shell.task([
        'mkdir ./dist',
        'mkdir ./dist/fonts',
        'mkdir ./dist/images',
        'mkdir ./dist/scripts',
        'mkdir ./dist/styles'
    ]);
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['html', 'scripts', 'styles', 'browserSync'], function () {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('app/scripts/src/**', ['scripts']);
    gulp.watch('app/styles/scss/**', ['styles']);
    gulp.watch('app/images/**', ['images']);
    // gulp.watch('app/*.html', ['html']);
    gulp.watch(['*.json', 'app/*.hbs'], ['html']);
});

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean-dist', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));