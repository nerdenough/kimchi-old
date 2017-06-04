import AWS from 'aws-sdk'
import config from 'config'

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

  try {
    const res = await lexRuntime.postText(params).promise()
    message.reply(res.message)
  } catch (err) {
    console.error(err)
  }
}
