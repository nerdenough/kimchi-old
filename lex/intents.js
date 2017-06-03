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
    type: 'CodeHook',
    codeHook: {
      messageVersion: '1.0',
      uri: process.env.AWS_LAMBDA_ARN
    }
  }
}]

export default intents
