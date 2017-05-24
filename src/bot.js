import AWS from 'aws-sdk'
import config from 'config'
import Discord from 'discord.js'

export async function handleMessage (message, client) {
  if (message.author.id === client.user.id) {
    return
  }

  const lexRuntime = new AWS.LexRuntime()
  const params = {
    botAlias: config.get('lex.botAlias'),
    botName: config.get('lex.botName'),
    inputText: message.content,
    userId: config.get('lex.userId')
  }

  try {
    const res = await lexRuntime.postText(params).promise()
    message.reply(res.message)
  } catch (err) {
    console.error(err)
  }
}

export function initialise () {
  const client = new Discord.Client()

  client.on('ready', () => console.log(`Logged in as ${client.user.username}!`))
  client.on('message', (message) => handleMessage(message, client))
  client.login(config.get('discord.token'))
}
