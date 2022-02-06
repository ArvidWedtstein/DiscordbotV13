import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import RPC from 'discord-rpc';
import mongo from './mongo.js';
import { MongoClient } from 'mongodb';
import consola, { Consola } from 'consola';
import * as dotenv from 'dotenv';
dotenv.config();

import * as handler from './command-handler.ts';
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ],
  presence: {
    status: "online",
    activities: [
      {
        name: "Screaming",
        type: "STREAMING",
        url: "https://twitch.tv/brawlhalla"
      },
      {
        name: "you",
        type: "WATCHING",
        url: "https://twitch.tv/brawlhalla"
      },
    ],
  },
  owner: "DrunkGerman#7117"
});
/*client.setProvider(
  MongoClient.connect(process.env.REMOTE_MONGODB, {
      useUnifiedTopology: true,
      //useFindAndModify: false
  }).then((client) => {
    return;
  }).catch((err) => {
    console.error(err);
  }) 
);*/

client.on('ready', async () => {
  console.log('Bot is online');
  client.user.setPresence({
    status: "online",
    //afk: true,
    activities: [
      {
        name: "/help",
        type: "WATCHING",
        url: "https://twitch.tv/brawlhalla",
      }
    ],
    buttons: [{label: "Test", url: "https://appextournament.netlify.app"}]
  })
  
  client.user.accentColor = "red";
  client.prefix = "<";
  client.commands = new Collection();
  client.slashCommands = new Collection();


  // Connect to mongoDB
  await mongo();

  
  let handler = handler;
  if (handler.default) handler = handler.default;
  handler(client);

  let SlashHandler = require('./slash-command-handler');
  if (SlashHandler.default) SlashHandler = SlashHandler.default;
  SlashHandler(client);

  /*client.application.commands.create({
    name: "sus",
    description: "yes, you. sussy boi",
  })*/

  /*RPC.register(process.env.CLIENT_ID)

  const rpc = new RPC.Client({
    transport: "ipc",
  })
  rpc.on("ready", () => {
    rpc.setActivity({
      details: "Working on",
      state: "Appex Tournaments",
      largeImageKey: client.user.avatarURL(),
      largeImageText: "Abbegs Tournaments",
      smallImageKey: "tdsfsdf",
      smallImageText: "sd",
      startTimestamp: Date.now(),
      buttons: [{label: "Til Appex Tournaments", url: "https://appextournament.netlify.app"}]
    })
  })
  
  rpc.login({
    clientId: process.env.CLIENT_ID
  })*/
})

client.login(process.env.CLIENT_TOKEN);
