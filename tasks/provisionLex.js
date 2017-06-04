import AWS from 'aws-sdk'
import gutil from 'gulp-util'
import bot from '../src/lex/bot'
import intents from '../src/lex/intents'

const lexModelBuildingService = new AWS.LexModelBuildingService()

async function provisionIntents () {
  return Promise.all(intents.map(async intent => {
    gutil.log(gutil.colors.cyan(`[Lex] Checking whether intent "${intent.name}" exists`))
    await lexModelBuildingService
      .getIntent({
        name: intent.name,
        version: '$LATEST'
      })
      .promise()
      .then((existingIntent) => {
        gutil.log(gutil.colors.cyan(`[Lex] Intent "${intent.name}" already exists`))
        gutil.log(gutil.colors.cyan(`[Lex] Updating intent "${intent.name}"`))
        intent.checksum = existingIntent.checksum
      })
      .catch(() => {
        gutil.log(gutil.colors.cyan(`[Lex] Intent "${intent.name}" does not exist`))
        gutil.log(gutil.colors.cyan(`[Lex] Creating intent "${intent.name}"`))
      })

    await lexModelBuildingService.putIntent(intent).promise()
    return lexModelBuildingService.createIntentVersion({ name: intent.name }).promise()
  }))
}

async function provisionBot () {
  gutil.log(gutil.colors.cyan(`[Lex] Checking whether bot "${bot.name}" exists`))
  await lexModelBuildingService
    .getBot({
      name: bot.name,
      versionOrAlias: '$LATEST'
    })
    .promise()
    .then((existingBot) => {
      gutil.log(gutil.colors.cyan(`[Lex] Bot "${bot.name}" already exists`))
      gutil.log(gutil.colors.cyan(`[Lex] Updating bot "${bot.name}"`))
      bot.checksum = existingBot.checksum
    })
    .catch(() => {
      gutil.log(gutil.colors.cyan(`[Lex] Bot "${bot.name}" does not exist`))
      gutil.log(gutil.colors.cyan(`[Lex] Creating bot "${bot.name}"`))
    })

  return lexModelBuildingService.putBot(bot).promise()
}

async function provisionBotAlias () {
  const alias = {
    name: process.env.BOT_ALIAS,
    botName: bot.name,
    botVersion: '$LATEST'
  }

  gutil.log(gutil.colors.cyan(`[Lex] Checking whether alias "${alias.name}" exists`))
  await lexModelBuildingService
    .getBotAlias({
      botName: bot.name,
      name: alias.name
    })
    .promise()
    .then((existingAlias) => {
      gutil.log(gutil.colors.cyan(`[Lex] Alias "${alias.name}" already exists`))
      gutil.log(gutil.colors.cyan(`[Lex] Updating alias "${alias.name}"`))
      alias.checksum = existingAlias.checksum
    })
    .catch(() => {
      gutil.log(gutil.colors.cyan(`[Lex] Alias "${alias.name}" does not exist`))
      gutil.log(gutil.colors.cyan(`[Lex] Creating alias "${alias.name}"`))
    })

  return lexModelBuildingService.putBotAlias(alias).promise()
}

async function provisionLex () {
  await provisionIntents()
  await provisionBot()
  await provisionBotAlias()
}

export default provisionLex
