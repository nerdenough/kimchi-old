import greetingIntent from './intents/greeting'

export const intents = [greetingIntent]

const intentsWithFulfillment = intents.map((intent) => {
  intent.fulfillmentActivity = {
    type: 'CodeHook',
    codeHook: {
      messageVersion: '1.0',
      uri: process.env.AWS_LAMBDA_ARN
    }
  }

  return intent
})

export default intentsWithFulfillment
