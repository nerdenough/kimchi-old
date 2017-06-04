import config from 'config'
const botName = config.get('bot.name')

const intent = {
  name: 'greeting',
  sampleUtterances: [
    `Hey ${botName}`,
    `Hi ${botName}`,
    `Hello ${botName}`,
    `Hola ${botName}`,
    `Aloha ${botName}`,
    `Greetings ${botName}`,
    `Yo ${botName}`,
    `Wassup ${botName}`
  ]
}

export default intent
