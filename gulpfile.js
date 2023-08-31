const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify-es').default;
const pipeline = require('readable-stream').pipeline;
const imagemin = require('gulp-imagemin');
const del = require('del');


gulp.task('css', async function(done) {
    const rev = await import("gulp-rev").then(function(revv){
        return revv.default || revv.rev;
    })
    console.log('Minifying CSS');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));
    return gulp.src('./assets/**/*.css')

    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge: true
    })).pipe(gulp.dest('./public/assets'));
});

gulp.task('js', async function(done){
    const rev = await import("gulp-rev").then(function(revv){
        return revv.default || revv.rev;
    })
    console.log('minifying js...');
    return pipeline(
        gulp.src('./assets/**/*.js'),
        uglify(),
        rev(),
        gulp.dest('./public/assets'),
        rev.manifest({
            cwd: 'public',
            merge: true
        }),
        gulp.dest('./public/assets')
)});

gulp.task('images', async function(done){
    const rev = await import("gulp-rev").then(function(revv){
        return revv.default || revv.rev;
    })
    console.log('Compressing Images...');
    return gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'))
})

// empty the public/assets directory
gulp.task('clean:assets', async function(){
    await del.sync(['./public/assets'], { force:true });
});

gulp.task('build', gulp.series( 'css', 'js', 'images', function(done){
    console.log('Building assets');
    done();
}))
