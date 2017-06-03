import AWS from 'aws-sdk'
import gutil from 'gulp-util'
import bot from '../lex/bot'
import intents from '../lex/intents'

async function provisionLex () {
  const lexModelBuildingService = new AWS.LexModelBuildingService()

  await Promise.all(intents.map(async intent => {
    gutil.log(gutil.colors.cyan(`[Lex] Checking whether intent "${intent.name}" exists`))
    const existingIntent = await lexModelBuildingService.getIntent({
      name: intent.name,
      version: '$LATEST'
    }).promise()

    gutil.log(gutil.colors.cyan(`[Lex] Creating intent "${intent.name}"`))
    if (existingIntent) {
      gutil.log(gutil.colors.cyan(`[Lex] Intent "${intent.name}" already exists, updating`))
      intent.checksum = existingIntent.checksum
    }

    await lexModelBuildingService.putIntent(intent).promise()
    await lexModelBuildingService.createIntentVersion({ name: intent.name }).promise()
  }))

  gutil.log(gutil.colors.cyan(`[Lex] Checking whether bot "${bot.name}" exists`))
  const existingBot = await lexModelBuildingService.getBot({
    name: 'kimchi',
    versionOrAlias: '$LATEST'
  }).promise()

  gutil.log(gutil.colors.cyan(`[Lex] Creating bot "${bot.name}"`))
  if (existingBot) {
    gutil.log(gutil.colors.cyan(`[Lex] Bot "${bot.name}" already exists, updating`))
    bot.checksum = existingBot.checksum
  }

  await lexModelBuildingService.putBot(bot).promise()
}

export default provisionLex
