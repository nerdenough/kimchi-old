import 'babel-polyfill'
import gulp from 'gulp'
import eslintTask from './tasks/eslint'
import mochaTask from './tasks/mocha'
import provisionLambdaTask from './tasks/provisionLambda'
import provisionLexTask from './tasks/provisionLex'

gulp.task('eslint', eslintTask)
gulp.task('mocha', mochaTask)
gulp.task('provisionLambda', provisionLambdaTask)
gulp.task('provisionLex', provisionLexTask)
gulp.task('default', ['eslint', 'mocha'])
