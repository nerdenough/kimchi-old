import AWS from 'aws-sdk'
import gutil from 'gulp-util'
import bot from '../src/lex/bot'
import intents from '../src/lex/intents'

async function provisionLex () {
  const lexModelBuildingService = new AWS.LexModelBuildingService()

  // Ensure all the intents are created before creating the bot itself
  await Promise.all(intents.map(async intent => {
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

  gutil.log(gutil.colors.cyan(`[Lex] Checking whether bot "${bot.name}" exists`))
  await lexModelBuildingService
    .getBot({
      name: 'kimchi',
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

export default provisionLex
