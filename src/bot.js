import config from 'config'
import Discord from 'discord.js'
import { handleMessage as handleMessageReceived } from './handlers/messageReceived'

export function initialise () {
  const client = new Discord.Client()

  client.on('ready', () => console.log(`Logged in as ${client.user.username}!`))
  client.on('message', (message) => handleMessageReceived(message, client))
  client.login(config.get('discord.token'))
}
