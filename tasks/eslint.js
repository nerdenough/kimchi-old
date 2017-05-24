import gulp from 'gulp'
import eslint from 'gulp-eslint'

function eslintTask () {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

export default eslintTask
