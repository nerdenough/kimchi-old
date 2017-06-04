import config from 'config'
const botName = config.get('bot.name')

export const intent = {
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
  ],
  getResponse: () => {
    const responses = [
      'hello!',
      'hey!',
      'greetings!',
      'what\'s up?'
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }
}

export default intent
