import config from 'config'
const botName = config.get('bot.name')

const intents = [{
  name: 'Greeting',
  sampleUtterances: [
    `Hey ${botName}`,
    `Hi ${botName}`,
    `Hello ${botName}`,
    `Yo ${botName}`
  ],
  fulfillmentActivity: {
    type: 'ReturnIntent'
  }
}]

export default intents
