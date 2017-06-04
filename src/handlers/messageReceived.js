import AWS from 'aws-sdk'
import config from 'config'
import { intents } from '../lex/intents'

export function generateResponse (message) {
  const intent = intents.find(i => i.name === message.currentIntent.name)

  if (!intent) {
    return 'I didn\'t quite catch that.'
  }

  return intent.getResponse(message.currentIntent.slots)
}

export async function handleMessage (message, client) {
  if (message.author.id === client.user.id || !message.isMentioned(client.user.id)) {
    return
  }

  const lexRuntime = new AWS.LexRuntime()
  const params = {
    botName: config.get('bot.name'),
    botAlias: config.get('bot.alias'),
    userId: config.get('bot.userId'),
    inputText: message.cleanContent
  }

  lexRuntime
    .postText(params)
    .promise()
    .then((res) => {
      try {
        const response = generateResponse(JSON.parse(res.message))
        message.reply(response)
      } catch (err) {
        message.reply(res.message)
      }
    })
    .catch((err) => console.error(err))
}
