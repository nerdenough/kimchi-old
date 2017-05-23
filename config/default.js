const config = {
  discord: {
    token: process.env.DISCORD_TOKEN
  },
  lex: {
    botAlias: process.env.AWS_BOT_ALIAS,
    botName: process.env.AWS_BOT_NAME,
    userId: process.env.AWS_USER_ID
  }
}

module.exports = config
