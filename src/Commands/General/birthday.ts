import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "birthday",
    description: "set your birthday",
    details: "set your birthday to recieve xp on your birthday.",
    aliases: ["setbirthday", "addbirthday"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["birthday <day>/<month>/<year>", "birthday 03/10/2004"],
    
    run: async(client, message, args) => {
        function suffixes(number: any) {
            const converted = number.toString();
        
            const lastChar = converted.charAt(converted.length - 1);
        
            return lastChar == "1" 
            ? `${converted}st` 
            : lastChar == "2" 
            ? `${converted}nd` 
            : lastChar == '3'
            ? `${converted}rd` 
            : `${converted}th`;
        }
        // message.delete()
        const { guild, channel, author, mentions } = message

        const guildId = guild?.id

  


        const months = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        }

        const user = guild?.members.cache.get(mentions?.users?.first()?.id || author.id)
        if (message.mentions.users.first()) {
            args.shift();
        }
        const joined = args.join(" ");
        const split = joined.trim().split("/");
        let [ day, month, year ]: any = split;

        
        if (!day) return message.reply(`${language(guild, 'BIRTHDAY_DAY')}`);
        if (!month) return message.reply(`${language(guild, 'BIRTHDAY_MONTH')}`);
        if (!year) return message.reply(`${language(guild, 'BIRTHDAY_MONTH')}`);
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return message.reply(`${language(guild, 'BIRTHDAY_NaN')}`)
        }

        day = parseInt(day);
        month = parseInt(month);
        year = parseInt(year);

        if (day < 10) {
            day = parseInt(`0${day}`)
        }
 
        if (day > 31 || day < 1) return message.reply(`${language(guild, 'BIRTHDAY_FORMAT')}`);
        if (month > 12 || month < 1) return message.reply(`${language(guild, 'BIRTHDAY_FORMAT')}`);
        if (year > new Date().getFullYear() || year < 1900) return message.reply(`${language(guild, 'BIRTHDAY_FORMAT')}`);

        const birthday = `${day}/${month}/${year}`;

        
        const userId = user?.id;
        const profileresult = await profileSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            $set: {
                birthday
            }
        }, {
            upsert: true,
        })
                
        if (!profileresult) {
            let embed = new MessageEmbed()
                .setColor(`AQUA`)
                .setAuthor({ name: `${user?.user.username}'s ${language(guild, 'BIRTHDAY_CHANGE')} **${birthday}**`, iconURL: user?.user?.displayAvatarURL() })
            message.reply({
                embeds: [embed]
            })
            new profileSchema({
                guildId,
                userId,
                $set: {
                    birthday
                }
            })
        } else {
            let embed = new MessageEmbed()
                .setColor(`AQUA`)
                .setAuthor({ name: `${user?.user.username}'s ${language(guild, 'BIRTHDAY_CHANGE')} ${birthday}`, iconURL: user?.user.displayAvatarURL({ dynamic: true})})
            message.reply({ embeds: [embed] })
        }
    }
}

