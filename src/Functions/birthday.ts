import { Client, Message, AttachmentBuilder, EmbedBuilder } from "discord.js";
import profileSchema from "../schemas/profileSchema";
import boticons from "./boticons";
import icon from "./icon";
import language from "./language";
import { addXP, getLevel } from "./Level";
import * as gradient from 'gradient-string';
import moment from "moment";

export default (client: Client) => {

  let lastBirthday = {
    date: "",
    checked: false
  }

  // Use this to check birthdays on the future
  const checkBirthday = (async () => {
    console.log(`${gradient.instagram(`Checking for birthdays`)}`);

    let dformat = moment().format('DD/MM')
    // Find all users with birthdays on this day
    // let users = await profileSchema.find({ birthday: dformat })
    let users = await profileSchema.find({ birthday: { $regex: dformat } })
    
    // If there are no users with birthdays on this day
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

    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      let userId = user.userId;
      let guildId = user.guildId;

      let guild = await client.guilds.cache.get(guildId);

      if (!guild) return;
      let channel = guild.channels.cache.find(x => x.name === "nyheter") || guild.rulesChannel;

      let birthdayUser = client.users.cache.get(userId) || guild.members.cache.get(userId);

      
      
      // TODO: Send the user a private message with the birthday message if user is not found.

      const attachment = new AttachmentBuilder('./img/banner.jpg', 'banner.jpg');


      setTimeout(async () => {
        if (!birthdayUser) return;
        let embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle(`:champagne:${await language(guild, 'BIRTHDAY_ANNOUNCEMENT')}!:champagne:`)
          .setThumbnail(birthdayUser.displayAvatarURL())
          .setDescription(`<@${userId}> ${await language(guild, 'BIRTHDAY_USER')}\n||.||\n${await language(guild, 'PROMOTE_USER')} to <@${userId}>! (+**5000**xp) `)
          .setImage('attachment://banner.jpg')
          .setFooter({ text: `This birthday wish was brought to you by ${client.user?.username}` })
          .setTimestamp()
    
        if (!channel || !channel.isText()) return birthdayUser.send({ embeds: [embed], files: [attachment] });
        
        channel.send({ embeds: [embed], files: [attachment] }).then(async (message) => {
          await addXP(guildId, userId, 5000, message)
        })
      }, 3000)
      
    }
  })


  // OLD BIRTHDAY CHECKER
  const checkForBirthday = async () => {
    const list = client.guilds.cache.get('524951977243836417');
    if (!list) return;
    list.members.cache.each(async (member) => {
      const { user, guild } = member;
      const userId = user.id
      const guildId = guild.id;
      let news = guild.channels.cache.find(channel => channel.name === 'nyheter');
      
      if (!news || !news.isText() || news.isVoice() || news.isThread()) {
        const name = `${language(guild, 'NEWS_CHANNELNAME')}`
        guild.channels.create(name, {
          topic: "News"
        })
        
        news = guild.channels.cache.find(channel => channel.name === `${language(guild, 'NEWS_CHANNELNAME')}`);
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

      let d = new Date,
      dformat = [
        d.getDate(),
        d.getMonth()+1,
      ].join('/')+''
      const birthday = dformat;
      
      if (results.birthday == '1/1') return;
      if (results.birthday !== birthday) return;

      const attachment = new AttachmentBuilder('./img/banner.jpg', 'banner.jpg');

      let embedCom = new EmbedBuilder()
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

          // Checks if the last sent EmbedBuilder description is the same as the current one so the message does not get sent twice
          if (str1 == str2) return;
          let EmbedBuilder = lastMessage?.channel.send({ embeds: [embedCom], files: [attachment] }).then((message: Message) => {
            addXP(guildId, userId, 5000, message)
          })
        } else {
          let EmbedBuilder = lastMessage?.channel.send({ embeds: [embedCom], files: [attachment] }).then((message: Message) => {
            addXP(guildId, userId, 5000, message)
          })
        }
    
      })
    }); 
    console.log(`${gradient.instagram(`Checking for birthdays`)}`);
  };

  checkBirthday();

  // Run checkForBirthday every 12 hours
  setInterval(checkBirthday, 43200 * 1000);
}


