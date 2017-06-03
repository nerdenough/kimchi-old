const config = {
  bot: {
    name: process.env.BOT_NAME || 'kimchi',
    alias: process.env.BOT_ALIAS || '',
    userId: process.env.AWS_ACCOUNT_ID || ''
  },
  discord: {
    token: process.env.DISCORD_TOKEN || ''
  }
}

module.exports = config
