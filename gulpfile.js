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

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: "app/",
      index: "index.html"
    },
    options: {
      reloadDelay: 250
    },
    notify: false
  });
});


//compressing images & handle SVG files
gulp.task('images', function (tmp) {
  gulp.src(['app/assets/images/*.jpg', 'app/assets/images/*.png'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('app/assets/images'));
});

//compressing images & handle SVG files
gulp.task('images-deploy', function () {
  gulp.src(['app/assets/images/**/*'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/images'));
});

//handle audio files
gulp.task('audio', function (tmp) {
  gulp.src(['app/assets/audio/*.mp3'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(gulp.dest('app/assets/audio'));
});

//handle audio files
gulp.task('audio-deploy', function () {
  gulp.src(['app/assets/audio/*'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/audio'));
});

//compiling our Javascripts
gulp.task('scripts', function () {
  //this is where our dev JS scripts are
  return gulp.src(['app/assets/scripts/**/*.js'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    //this is the filename of the compressed version of our JS
    // .pipe(concat('app.js'))
    //catch errors
    .on('error', gutil.log)
    //where we will store our finalized, compressed script
    .pipe(gulp.dest('app/assets/scripts'))
    //notify browserSync to refresh
    .pipe(browserSync.reload({
      stream: true
    }));
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function () {
  //this is where our dev JS scripts are
  return gulp.src(['app/assets/scripts/**/*.js'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    //compress :D
    .pipe(minify())
    //where we will store our finalized, compressed script
    .pipe(gulp.dest('dist/assets/scripts'));
});

//compiling our SCSS files
gulp.task('styles', function () {
  //the initializer / master SCSS file, which will just be a file that imports everything
  return gulp.src('app/assets/styles/scss/main.scss')
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
        'app/assets/styles/scss/',
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
    .pipe(gulp.dest('app/assets/styles'))
    //notify browserSync to refresh
    .pipe(browserSync.reload({
      stream: true
    }));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function () {
  //the initializer / master SCSS file, which will just be a file that imports everything
  return gulp.src('app/assets/styles/scss/main.scss')
    .pipe(plumber())
    //include SCSS includes folder
    .pipe(sass({
      includePaths: [
        'app/assets/styles/scss',
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
    .pipe(gulp.dest('dist/assets/styles'));
});

//basically just keeping an eye on all HTML files
gulp.task('html', function () {
  //watch any and all HTML files and refresh when something changes
  return gulp.src('app/*.html')
    .pipe(plumber())
    .pipe(browserSync.reload({
      stream: true
    }))
    //catch errors
    .on('error', gutil.log);
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function () {
  //grab everything, which should include robots, etc
  gulp.src(['app/*.html', 'app/favicon.ico'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(gulp.dest('dist'));

  //grab any hidden files too
  gulp.src('app/.*')
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(gulp.dest('dist'));

  gulp.src('app/assets/fonts/**/*')
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/fonts'));

  //grab all of the styles
  gulp.src(['app/assets/styles/*.css'])
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/styles'));
});

//cleans our dist directory in case things got deleted
gulp.task('clean-dist', function () {
  return del([
    'dist/*'
  ]);
});

//create folders using shell
gulp.task('scaffold', function () {
  return shell.task([
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
  gulp.watch('app/assets/scripts/**', ['scripts']);
  gulp.watch('app/assets/styles/scss/**', ['styles']);
  gulp.watch('app/assets/images/**', ['images']);
  gulp.watch('app/assets/audio/**', ['audio']);
  gulp.watch('app/*.html', ['html']);
});

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean-dist', 'scaffold', ['scripts-deploy', 'audio-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));