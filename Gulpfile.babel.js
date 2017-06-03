import 'babel-polyfill'
import gulp from 'gulp'
import eslintTask from './tasks/eslint'
import mochaTask from './tasks/mocha'
import provisionLexTask from './tasks/provisionLex'

gulp.task('eslint', eslintTask)
gulp.task('mocha', mochaTask)
gulp.task('provisionLex', provisionLexTask)
gulp.task('default', ['eslint', 'mocha'])
