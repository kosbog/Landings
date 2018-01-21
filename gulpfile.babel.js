require('babel-register');

'use strict';

import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import fs from 'fs';
import vfs from 'vinyl-fs';
// import { projects, getDirectories } from './deploy/getProjects';
import merge from 'merge2';
import { argv } from 'yargs';
import process from 'process';
// const ENV = process.env.NODE_ENV;
const MOBILE_DIR = '__mobile';

const BABEL_IGNORE = ['f7ec749.js', 'less.js', 'af22126.js', 'html5.js', 'nearest.js', 'velocity.js', 'transition.js', 'buzz.min.js', 'edge.6.0.0.min.js', 'index_edge.js', 'index_edgeActions.js'];

const
    $ = gulpLoadPlugins({lazy: true}),
    destDir = argv.project ? `./public/${argv.project}` : './public';

// function isDirExist(path, foldername) {
//     const dirs = getDirectories(path);
//     return dirs.indexOf(foldername) !== -1;
// }

gulp.task('shared', () => {
    return gulp.src(['./shared/*.js'])
        .pipe($.babel())
        .pipe($.if(!argv.project, $.uglify()))
        .pipe(gulp.dest('./public/shared/'))
        .pipe(browserSync.stream())
});

gulp.task('js', () => {
    return gulp.src([
        './projects/**/*.js',
        '!projects/**/{cookie,shared}.js'
        ])
        .pipe($.babel({
            ignore: BABEL_IGNORE
        }))
        // .pipe($.if(ENV === 'stage', $.replace(/(api\.pdgamedev)/g, 'api-stage.pdgamedev')))
        // .pipe($.if(ENV === 'prod', $.replace(/(api-stage)/g, 'api')))
        .pipe($.uglify())
        .pipe(gulp.dest(destDir));
});

gulp.task('symlinks', () => {
    return vfs.src([
            './projects/**/{cookie,shared}.js',
            '!./shared/{cookie,shared}.js'
        ], {
            followSymlinks: false
        })
        .pipe(vfs.dest(destDir))
});

gulp.task('sass', () => {
    return gulp.src('./projects/**/*.scss')
        .pipe($.sass()
            .on('error', $.sass.logError))
        .pipe($.postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe($.csso({
            restructure: false,
            debug: false
        }))
        .pipe(gulp.dest(destDir));
});

gulp.task('images', () => {
    return gulp.src('./projects/**/*.+(png|gif|jpg|jpeg|ico)', {follow: true})
        .pipe(gulp.dest(destDir))
});

gulp.task('images.min', () => {
    return gulp.src('projects/**/*.+(png|jpg|jpeg)', {follow: true})
        .pipe($.image({
            pngquant: true,
            optipng: true,
            jpegoptim: true,
            mozjpeg: true
        }))
        .pipe(gulp.dest('projects'))
})

gulp.task('videos', () => {
    return gulp.src('./projects/**/*.+(mp4|ogv|ogg|webm)')
        .pipe(gulp.dest(destDir))
});

gulp.task('copy_assets', () => {
    return gulp.src('./projects/**/*.+(less|css|cur|svg|ttf|otf|eot|woff|woff2|txt|mp3)', {follow: true})
        .pipe(gulp.dest(destDir));
});

gulp.task('assets.revisioning', ['js', 'sass'], () => {
    return gulp.src(`./projects/**/*.html`)
        .pipe($.versionNumber({
            value: '%TS%',
            append: {
                key: 'v',
                to: ['css', 'js']
            }
        }))
        .pipe(gulp.dest(destDir))
});

gulp.task('js:local', () => {
    return gulp.src([
        `./projects/${argv.project}/**/*.js`,
        `!projects/${argv.project}/**/{cookie,shared}.js`,
        `!projects/${argv.project}/__mobile/**/*.js`
        ])
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(destDir))
        .pipe(browserSync.stream())
});

gulp.task('symlinks:local', () => {
    return vfs.src(`./projects/${argv.project}/**/{cookie,shared}.js`, {
            followSymlinks: false
        })
        .pipe(vfs.dest(destDir))
});

gulp.task('sass:local', () => {
    return gulp.src(`./projects/${argv.project}/**/*.scss`)
        .pipe($.sourcemaps.init())
        .pipe($.sass()
            .on('error', $.sass.logError))
        .pipe($.postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(destDir))
        .pipe(browserSync.stream());
});

gulp.task('copy_assets:local', () => {
    return gulp.src(`./projects/${argv.project}/**/*.+(css|less|html|png|svg|gif|jpg|jpeg|ico|cur|ttf|otf|eot|woff|woff2|txt|mp3)`)
        .pipe(gulp.dest(destDir))
        .on('end', browserSync.reload);
});

gulp.task('browser-sync', () => {

    browserSync.init({
        server: {
            baseDir: `./public/${argv.project}`
        },
        logLevel: 'info'
    });

    gulp.watch('./shared/**/*.js', ['shared']);
    gulp.watch(`./projects/${argv.project}/**/*.js`, ['js:local']);
    gulp.watch(`./projects/${argv.project}/**/*.scss`, ['sass:local']);
    gulp.watch(`./projects/${argv.project}/**/*.+(css|html|png|svg|gif|jpg|ico|ttf|otf|eot|woff|woff2)`, ['copy_assets:local']);
});

gulp.task('check_argv', () => {
   if (!argv.project) {
       console.log('- - - - - - - - - - - - - - - - - - - - - ');
       console.log('--project=path/to/landing must be defined!');
       console.log('- - - - - - - - - - - - - - - - - - - - - ');
       return;
   }
});

gulp.task('default', ['check_argv', 'shared', 'symlinks:local', 'js:local', 'sass:local', 'copy_assets:local', 'browser-sync']);

// gulp.task('build', ['images', 'videos', 'shared', 'symlinks', 'copy_assets', 'assets.revisioning'], () => {
//     let streams = projects.map(project => {
//         if(!isDirExist(`./public/${project}`, MOBILE_DIR)) {
//             fs.mkdirSync(`./public/${project}/${MOBILE_DIR}`);
//         }

//         return vfs.src([`./public/${project}/**`, `!public/${project}/{${MOBILE_DIR},${MOBILE_DIR}/**}`])
//                 .pipe(vfs.symlink(`${destDir}/${project}/${MOBILE_DIR}`));
//     });
//     return merge(streams);
// });


