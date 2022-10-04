import { Client, Message, AttachmentBuilder, EmbedBuilder } from "discord.js";
import profileSchema from "../schemas/profileSchema";
import settingsSchema from "../schemas/settingsSchema";
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

    let guildsBirthday = await settingsSchema.find({ birthday: { $eq: true } });
    guildsBirthday = guildsBirthday.map((g) => { g.guildId });
    
    let dformat = moment().format('DD/MM')
    // Find all users with birthdays on this day
    // let users = await profileSchema.find({ birthday: dformat })
    let users = await profileSchema.find({ 
        birthday: { $regex: dformat }, 
        guildId: { $in: guildsBirthday } 
    });
    
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

      const attachment = new AttachmentBuilder('./img/banner.jpg');


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
    
        if (!channel) return 
        if (!channel.isTextBased()) return birthdayUser.send({ embeds: [embed], files: [attachment] });
        
        channel.send({ embeds: [embed], files: [attachment] }).then(async (message) => {
          await addXP(guildId, userId, 5000, message)
        })
      }, 3000)
      
    }
  })
  checkBirthday();

  // Run checkForBirthday every 24 hours
  setInterval(checkBirthday, 86400 * 1000);
}


