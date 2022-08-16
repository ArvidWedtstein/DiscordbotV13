import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import moment from 'moment';
import { blob } from 'stream/consumers';
export const command: Command = {
    name: "birthdays",
    description: "see upcoming birthdays",
    details: "see the upcoming birthdays for the next month",
    aliases: ["upcommingbirthdays"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    run: async(client, message, args) => {
        const { guild, channel, author } = message
            
        if (!guild) return;
        
        profileSchema.find({ guildId: { $eq: guild.id }, birthday: { $ne: "1/1", $exists: true } }).then(async users => {

            // Sort birthdays
            let birthdays = users.sort((a, b) => {
                let ab = a.birthday.split('/')
                let bb = b.birthday.split('/')
                let aDate = new Date(`${ab[2]}-${ab[1]}-${ab[0]}`)
                let bDate = new Date(`${bb[2]}-${bb[1]}-${bb[0]}`)
                return aDate.getTime() - bDate.getTime();
            });

            // Map the users and their birthdays
            let userList = birthdays.map(user => {
                let bd = user.birthday.split('/')
                let bdDate = new Date(`${bd[2]}-${bd[1]}-${bd[0]}`).setFullYear(new Date().getFullYear())
                return `${moment(bdDate).isBefore(new Date()) ? "" : `${user.userId == author.id ? `**${guild?.members.cache.get(user.userId)?.user.username} - ${user.birthday}**` : `${guild?.members.cache.get(user.userId)?.user.username} - ${user.birthday}`}`}`
            }).join('\n')

            const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

            let embed = new MessageEmbed()
                .setTitle(`Upcoming Birthdays:`)
                .setDescription(`${userList}`)
                .setImage('attachment://banner.jpg')
                .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            channel.send({ embeds: [embed], files: [attachment] })
        })
    }
}

