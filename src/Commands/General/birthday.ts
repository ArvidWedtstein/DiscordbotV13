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
    examples: ["birthday <day>/<month>", "birthday 03/10"],
    
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
        message.delete()
        const { guild, channel, author, mentions } = message

        const guildId = guild?.id

        var d = new Date,
            dformat = [
                d.getDate(),
                d.getMonth()+1,
            ].join('/')+' '


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
        console.log(split)
        let [ day, month ]: any = split;

        
        if (!day) return message.reply(`${language(guild, 'BIRTHDAY_DAY')}`);
        if (!month) return message.reply(`${language(guild, 'BIRTHDAY_MONTH')}`);
        if (isNaN(day) || isNaN(month)) {
            return message.reply(`${language(guild, 'BIRTHDAY_NaN')}`)
        }

        day = parseInt(day);
        month = parseInt(month);
        console.log(day, month)
        if (!day || day > 31) return message.reply(`${language(guild, 'BIRTHDAY_FORMAT')}`);
        if (!month || month > 12) return message.reply(`${language(guild, 'BIRTHDAY_FORMAT')}`);

        const birthday = `${day}/${month}`;

        
        const userId = user?.id;
        const profileresult = await profileSchema.findOne({ guildId, userId })
                
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

            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                $set: {
                    birthday
                }
            }, {
                upsert: true,
            })
        }
    }
}

