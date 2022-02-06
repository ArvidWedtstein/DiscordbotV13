import { Client } from 'discord.js';
import getFiles from './get-files.ts'
import fs from 'fs';

module.exports = (client) => {
  const commands = {}

  const suffix = ".ts";

  const commandFiles = getFiles('./commands', suffix);
  console.log(commandFiles)

  commandFiles.forEach(command => {
    let commandFile = require(command);
    //if (commandFile.default) commandFile = commandFile.default;

    // replace backslash with forwardslash
    const split = command.replace(/\\/g, "/").split("/");
    const commandName = split[split.length - 1].replace(suffix, "");
    
    commands[commandName.toLowerCase()] = commandFile;
  })
  client.commands = commands;
  console.log(commands);
  client.on("messageCreate", (message) => {
    if (message.author.bot || !message.content.startsWith(client.prefix)) {
      return
    }

    const args = message.content.slice(1).split(/ +/)
    const commandName = args.shift()?.toLowerCase()

    if (!commands[commandName]) {
      return
    }

    try {
      commands[commandName].callback(client, message, ...args);
    } catch (error) {
      console.error(error)
    }
  })



}