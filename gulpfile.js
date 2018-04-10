const gulp = require('gulp'),
      gp = require('gulp-load-plugins')(),
      fileinclude = require('gulp-file-include'),
      del = require('del'),
      run = require('run-sequence'),

      rsp = require('remove-svg-properties').stream,

      browserSync = require('browser-sync').create(),
      reload = browserSync.reload,

      spritesmith = require('gulp.spritesmith');

// server
gulp.task('server', function() {
  browserSync.init({
    open: false,
    notify: false,
    server: {
      baseDir: './public',
      index: 'login.html'
    }
  });
});

// sass
gulp.task('sass', () => {
  gulp.src('./source/scss/path/style.scss')
    .pipe(gp.plumber())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.sass())
    .pipe(gp.autoprefixer({
      browsers : ['> 5%'],
      cascade : false
    }))
    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('./public/css'))
    .pipe(gp.csso())
    .pipe(gp.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(reload({stream : true}))
});

// html
gulp.task('html', () => {
  gulp.src('./source/*.html')
    .pipe(gp.plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(reload({stream : true}));
});

// image
gulp.task('images', () => {
  gulp.src('./source/img/**/*.{png,jpg,jpeg,svg}')
    .pipe(gp.plumber())
    .pipe(gp.imagemin([
      gp.imagemin.jpegtran({progressive: true}),
      gp.imagemin.optipng({optimizationLevel: 3}),
      gp.imagemin.svgo()
    ]))
    .pipe(gulp.dest('./public/img/'))
    .pipe(reload({stream : true}));
});

// webp
gulp.task('webp', function () {
  return gulp.src('./source/img/**/*.{png,jpg}')
    .pipe(gp.plumber())
    .pipe(gp.webp({quality: 90}))
    .pipe(gulp.dest('./public/img/'))
    .pipe(reload({stream : true}));
});

// SVG-спрайт
gulp.task('sprite', function () {
  gulp.src('./source/img/sprite/*.svg')
    .pipe(gp.plumber())
    .pipe(rsp.remove({
        properties: [rsp.PROPS_FILL]
    }))
    .pipe(gp.svgstore({
      inlineSvg: true
    }))
    .pipe(gp.rename('sprite.svg'))
    .pipe(gulp.dest('./public/img/'))
    .pipe(reload({stream : true}));
});

gulp.task('scripts', function () {
  gulp.src('./source/js/**/*.js')
    .pipe(gp.plumber())
    // .pipe(gp.concat())
    .pipe(gulp.dest('./public/js/'))
    .pipe(gp.uglify())
    .pipe(gp.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/js/'))
    .pipe(reload({stream : true}));
});

gulp.task('fonts', function() {
  return gulp.src('./source/fonts/**', {
    base: './source'
  })
  .pipe(gulp.dest('./public'));
});

gulp.task('clean', function() {
  return del('./public');
});

gulp.task('build', function(done) {
  run('clean',
    'fonts',
    'sass',
    'images',
    'scripts',
    'html',
    'webp', done);
});

gulp.task('watch', () => {
  gulp.watch('source/**/*', ['fonts']);
  gulp.watch('source/**/*.html', ['html']);
  gulp.watch('source/**/*.scss', ['sass']);
  gulp.watch('source/**/*', ['images']);
  gulp.watch('source/**/*', ['scripts']);
  gulp.watch('source/**/*', ['sprite']);
  gulp.watch('source/**/*', ['webp']);
});

gulp.task('default', [
  'fonts',
  'sass',
  'html',
  'scripts',
  'images',
  'webp',
  'server', 'watch'
]);
