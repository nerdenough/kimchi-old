import AWS from 'aws-sdk'
import gutil from 'gulp-util'
import config from 'config'
import JSZip from 'jszip'
import fs from 'fs'
import path from 'path'

const botName = config.get('bot.name')

async function provisionLambda () {
  gutil.log(gutil.colors.cyan('[λ] Zipping lambda contents'))
  const lambda = new AWS.Lambda()

  const zip = new JSZip()
  zip.file('index.js', fs.readFileSync(path.join(__dirname, '../src/lambda/index.js')))
  const code = await zip.generateAsync({ type: 'arraybuffer' })

  const functionName = `${botName}MessageHandler`
  gutil.log(gutil.colors.cyan(`[λ] Checking whether function "${functionName}" exists`))

  return lambda
    .getFunction({
      FunctionName: functionName
    })
    .promise()
    .then(() => {
      gutil.log(gutil.colors.cyan(`[λ] Function "${functionName}" already exists`))
      gutil.log(gutil.colors.cyan(`[λ] Updating lambda function "${functionName}"`))
      return lambda.updateFunctionCode({
        FunctionName: functionName,
        ZipFile: code,
        Publish: true
      }).promise()
    })
    .catch(async () => {
      gutil.log(gutil.colors.cyan(`[λ] Function "${functionName}" does not exist`))
      const params = {
        Code: {
          ZipFile: code
        },
        FunctionName: functionName,
        Handler: 'index.handler',
        Publish: true,
        Role: process.env.AWS_LAMBDA_ROLE,
        Runtime: 'nodejs6.10'
      }

      gutil.log(gutil.colors.cyan(`[λ] Creating lambda function "${functionName}"`))
      await lambda.createFunction(params).promise()

      gutil.log(gutil.colors.cyan(`[λ] Allowing lex to invoke "${functionName}"`))
      const permission = {
        Action: 'lambda:invokeFunction',
        FunctionName: functionName,
        Principal: 'lex.amazonaws.com',
        SourceArn: `arn:aws:lex:us-east-1:${process.env.AWS_ACCOUNT_ID}:intent:*:*`,
        StatementId: 'allow-lex-invocation'
      }
      return lambda.addPermission(permission).promise()
    })
}

export default provisionLambda
