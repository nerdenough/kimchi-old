import gulp from 'gulp'
import mocha from 'gulp-mocha'

function mochaTask () {
  return gulp.src('tests/**/*.js').pipe(mocha({
    compilers: 'babel-core/register',
    require: ['./tests/setup']
  }))
}

export default mochaTask
