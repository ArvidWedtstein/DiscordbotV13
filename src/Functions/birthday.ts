import { Client, Message, MessageAttachment, MessageEmbed } from "discord.js";
import profileSchema from "../schemas/profileSchema";
import boticons from "./boticons";
import icon from "./icon";
import language from "./language";
import { addXP, getLevel } from "./Level";
import * as gradient from 'gradient-string';

export default (client: Client) => {

  let lastBirthday = {
    date: "",
    checked: false
  }
  const checkBirthday = (async () => {
    const date = new Date()
    let dformat = [
      date.getDate(),
      date.getMonth()+1,
    ].join('/')+''
    
    // Find all users with birthdays on this day
    let users = await profileSchema.find({birthday: dformat})
    if (users.length < 1) return;

    // Check if we already checked today
    if (dformat != lastBirthday.date) {
      lastBirthday.date = dformat
      lastBirthday.checked = false
    }
    if (lastBirthday.checked) return;

    lastBirthday = {
      date: dformat,
      checked: true
    }

    for(let i = 0; i < users.length; i++) {
      let user = users[i];
      let userId = user.userId;
      let guildId = user.guildId;

      let guild = client.guilds.cache.get(guildId);

      if (!guild) return;
      let channel = guild.publicUpdatesChannel;

      let userGuild = client.users.cache.get(userId) || guild.members.cache.get(userId);

      // TODO: Send the user a private message with the birthday message if user is not found.
      if (!userGuild) return;

      const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');


      let embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`:champagne:${language(guild, 'BIRTHDAY_ANNOUNCEMENT')}!:champagne:`)
        .setThumbnail(userGuild.displayAvatarURL())
        .setDescription(`<@${userId}> ${language(guild, 'BIRTHDAY_USER')}\n||@everyone||\n${language(guild, 'PROMOTE_USER')} to <@${userId}>! (+**5000**xp) `)
        .setImage('attachment://banner.jpg')
        .setFooter({ text: `This birthday wish was brought to you by ${client.user?.username}` })
        .setTimestamp()
  
      channel?.send({ embeds: [embed], files: [attachment] }).then((message: Message) => {
        addXP(guildId, userId, 5000, message)
      })
    }
  })


  // TODO: rework this to be more dynamic
  const checkForBirthday = async () => {
    const list = client.guilds.cache.get('524951977243836417');
    if (!list) return;
    list.members.cache.each(async (member) => {
      const { user, guild } = member;
      const userId = user.id
      const guildId = guild.id;
      let news = guild.channels.cache.find(channel => channel.name === 'nyheter');
      
      if (!news || !news?.isText() || news.isVoice() || news.isThread()) {
        const name = `${language(guild, 'NEWS_CHANNELNAME')}`
        guild.channels.create(name, {
          topic: "Test"
        })
        
        news = guild.channels.cache.find(channel => channel.name === 'nyheter');
        if (!news) return;
        
      }
      if (
        news.isThread() || 
        news.isVoice() || 
        !news.isText() || 
        !news || 
        !news.manageable
       ) return;

      
      const results = await profileSchema.findOne({
        userId
      })

      if (!results) return

      var d = new Date,
      dformat = [
        d.getDate(),
        d.getMonth()+1,
      ].join('/')+''
      const birthday = dformat;
      
      if (results.birthday == '1/1') return;
      if (results.birthday !== birthday) return;

      const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

      let embedCom = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`:champagne:${language(guild, 'BIRTHDAY_ANNOUNCEMENT')}!:champagne:`)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`<@${results.userId}> ${language(guild, 'BIRTHDAY_USER')}\n@everyone\n${language(guild, 'PROMOTE_USER')} to <@${results.userId}>! (+5000xp) `)
        .setImage('attachment://banner.jpg')

      news?.messages.fetch({ limit: 1 }).then(async (messages) => {
        let lastMessage = messages.first();
        
        if (!lastMessage) return; 
        if (lastMessage?.embeds[0]) {
          // check if last embed is same as current to prevent double birthday announcement
          let last = lastMessage.embeds[0].description
          let str1 = last?.substring(0, last.indexOf(" "))
          let str2 = embedCom?.description?.substring(0, embedCom.description.indexOf(" "))

          // Checks if the last sent messageembed description is the same as the current one so the message does not get sent twice
          if (str1 == str2) return;
          let messageEmbed = lastMessage?.channel.send({ embeds: [embedCom], files: [attachment] }).then((message: Message) => {
            addXP(guildId, userId, 5000, message)
          })
        } else {
          let messageEmbed = lastMessage?.channel.send({ embeds: [embedCom], files: [attachment] }).then((message: Message) => {
            addXP(guildId, userId, 5000, message)
          })
        }
    
      })
    }); 
    console.log(`${gradient.instagram(`Checking for birthdays`)}`);
  };
  checkForBirthday();

  // Run checkForBirthday every 12 hours
  setInterval(checkForBirthday, 43200 * 1000);
}


