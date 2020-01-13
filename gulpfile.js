//gulpfile.js
const
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify');
buffer = require('vinyl-buffer'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin')
;

//paths
const
    sassFiles = 'src/scss/**/*.scss',
    cssDest = 'dist/css/',

    htmlFiles = 'src/*.html',
    htmlDest = 'dist/',

    imgFiles = 'src/img/*',
    imgDest = 'dist/img/',

    tsFiles = 'src/ts/**/*.ts',
    jsDest = 'dist/js/'
;


gulp.task('scripts', () => {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsDest))
        .pipe(reload({stream: true}))
        ;
});

gulp.task('styles', () => {
    return gulp
        .src(sassFiles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssDest))
        .pipe(reload({stream: true}))
        ;
});

gulp.task('copy-html', () => {
    return gulp
        .src(htmlFiles)
        .pipe(gulp.dest('./dist'))
        .pipe(reload({stream: true}))
        ;
});

gulp.task('copy-jmg', () => {
    return gulp
        .src(imgFiles)
        .pipe(changed(imgDest))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDest))
        .pipe(reload({stream: true}))
        ;
});


gulp.task('watch', gulp.series('styles', 'scripts', 'copy-html', 'copy-jmg', () => {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(sassFiles, gulp.series('styles'));
    gulp.watch(tsFiles, gulp.series('scripts'));
    gulp.watch(htmlFiles, gulp.series('copy-html'));
    gulp.watch(imgFiles, gulp.series('copy-jmg'));

}));

