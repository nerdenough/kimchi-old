import gulp from 'gulp'
import mochaTask from './tasks/mocha'

gulp.task('mocha', mochaTask)
gulp.task('default', ['mocha'])
