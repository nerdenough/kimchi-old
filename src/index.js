import AWS from 'aws-sdk'
import config from 'config'
import Discord from 'discord.js'

const client = new Discord.Client()

async function handleMessage (message) {
  if (message.author.id === client.user.id) {
    return
  }

  const channel = message.channel
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

client.on('ready', () => console.log(`Logged in as ${client.user.username}!`))
client.on('message', handleMessage)
client.login(config.get('discord.token'))
