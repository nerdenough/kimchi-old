import config from 'config'

const bot = {
  childDirected: false,
  locale: 'en-US',
  name: config.get('bot.name'),
  intents: [{
    intentName: 'greeting',
    intentVersion: '$LATEST'
  }],
  processBehavior: 'BUILD',
  abortStatement: {
    messages: [{
      content: 'I have no idea what you\'re saying.',
      contentType: 'PlainText'
    }, {
      content: 'I don\'t understand you.',
      contentType: 'PlainText'
    }]
  },
  clarificationPrompt: {
    maxAttempts: 1,
    messages: [{
      content: 'what?',
      contentType: 'PlainText'
    }, {
      content: 'you\'re gonna need to rephrase that.',
      contentType: 'PlainText'
    }]
  }
}

export default bot
