const { Client, Constants } = require('discord.js');
const getFiles = require('./get-files');
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const fs = require('fs');

module.exports = (client) => {
  // const commands = {}
  const commands = [].map(command => command.toJSON())
  const commands2 = [].map(command => command.toJSON())

  const suffix = ".js";
  const commandFiles = getFiles('./SlashCommands', suffix);

  commandFiles.forEach(async (command) => {
    let commandFile = require(command);

    if (commandFile.default) commandFile = commandFile.default;

    const split = command.replace(/\\/g, "/").split("/");
    const commandName = split[split.length - 1].replace(suffix, "");
    
    //commands[commandName.toLowerCase()] = commandFile;
    commands.push(commandFile)
    /*client.application.commands.create({
      name: commandFile.name,
      description: commandFile.description
    }).then(res => {
      //console.log(res)
    }).catch(error => {
      console.error("errorslashcmd" + error)
    })*/
    
    const cmd = new SlashCommandBuilder()
      .setName(commandFile.name)
      .setDescription(commandFile.description)
      
    if (commandFile.options) {
      commandFile.options.forEach(option => {
        switch (option.type) {
          case "USER":
            cmd.addUserOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required))
            break;
          case "STRING":
            cmd.addStringOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required))
            break;
          case "NUMBER":
            cmd.addNumberOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required))
            break;
          default:
            break;
        }
      })
    }
    commands2.push(cmd)

  })
  const app = new ContextMenuCommandBuilder()
    .setName('Test')
    .setType(2)
  
  commands2.push(app)

  

  const rest = new REST({ version: '9' }).setToken(process.env.CLIENT_TOKEN);

  (async () => {
    try {
      console.log('Started getting application (/) commands.');
      
      await rest.get(
        //Routes.applicationCommands("923144434982465537")
        Routes.applicationGuildCommands(process.env.APPLICATION_ID, "880698307595345990")
      ).then(async (res) => {
        console.log("DB DATA")
        console.log(res)
        res.forEach(cmd => {
          client.slashCommands.set(cmd.name, cmd);
        })
        console.log(client.slashCommands)
      })
    } catch (error) {
      console.error("get error" + error);
    }
    try {
      console.log('Started refreshing application (/) commands.');
      
      await rest.put(
        Routes.applicationGuildCommands(process.env.APPLICATION_ID, "880698307595345990"),
        // Routes.applicationCommands("923144434982465537"),
        { body: commands2 },
      ).then(async (res) => {
        console.log("NEW COMMANDS")
        //console.log(res)
        res.forEach(cmd => {
          client.slashCommands.set(cmd.name, cmd);
        })
      })
    } catch (error) {
      console.error("NEW SLASH" + error);
    }
  })();
  client.on("interactionCreate", async (interaction) => {
    console.log(interaction.type)
    if (interaction.type == "APPLICATION_COMMAND") {
      if (interaction.targetType == "USER") {
        interaction.reply('bruh');
      }
      if (!interaction.isCommand()) {
        console.error('is not command')
        console.log(interaction)
        return
      }
      const { commandName, options } = interaction;
      console.log(client.slashCommands)
      console.log(commands)
  
      //if (!commands[commandName]) {
      // if (client.slashCommands.find(cmd => cmd.name === commandName)) {
      if (!commands.find(cmd => cmd.name === commandName) || !client.slashCommands.find(cmd => cmd.name === commandName)) {
        console.error("invalid commandname")
        interaction.reply("invalid command")
        return
      }
      try {
        const cmd = commands.find(cmd => cmd.name === commandName)
        cmd.callback(interaction, client);
      } catch (error) {
        console.error(error)
      }
    }
  })
}