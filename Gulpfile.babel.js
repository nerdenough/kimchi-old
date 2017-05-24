import gulp from 'gulp'
import eslintTask from './tasks/eslint'
import mochaTask from './tasks/mocha'

gulp.task('eslint', eslintTask)
gulp.task('mocha', mochaTask)
gulp.task('default', ['eslint', 'mocha'])
