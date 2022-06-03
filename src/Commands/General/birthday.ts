import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import { profile } from 'console';
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

        const { guild, channel, author, mentions } = message

        if (!guild) return;
        

        const user = guild.members.cache.get(mentions?.users?.first()?.id || author.id)

        if (mentions.users.first()) {
            args.shift();
        }
        const joined = args.join(" ");
        const split = joined.trim().split("/");
        let [ day, month, year ]: any = split;

        
        if (!day) return temporaryMessage(channel, `${language(guild, 'BIRTHDAY_DAY')}`, 10);
        if (!month) return temporaryMessage(channel, `${language(guild, 'BIRTHDAY_MONTH')}`, 10);
        if (!year) return temporaryMessage(channel, `${language(guild, 'BIRTHDAY_YEAR')}`, 10);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return temporaryMessage(channel, `${language(guild, 'BIRTHDAY_NaN')}`, 10);

        day = parseInt(day);
        month = parseInt(month);
        year = parseInt(year);

        function ifNumberIsLessThanTen(number: number) {
            if (number < 10) {
                return `0${number}`;
            }
            return number;
        }
        
        day = ifNumberIsLessThanTen(day);
        month = ifNumberIsLessThanTen(month);
 
        if (day > 31 || day < 1) return temporaryMessage(channel, `${language(guild, 'BIRTHDAY_FORMAT')}`, 10);
        if (month > 12 || month < 1) return temporaryMessage(channel, `${language(guild, 'BIRTHDAY_FORMAT')}`, 10);
        if (year > new Date().getFullYear() || year < 1900) return temporaryMessage(channel, `${language(guild, 'BIRTHDAY_FORMAT')}`, 10);

        const birthday = `${day}/${month}/${year}`;

        
        const userId = user?.id;
        const proresult = await profileSchema.updateMany({ userId }, { $set: { birthday } });


        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
        
        let embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ 
                name: `${user?.user.username}'s ${language(guild, 'BIRTHDAY_CHANGE')} ${birthday}`, 
                iconURL: user?.user.displayAvatarURL({ dynamic: true})
            })
            .setImage('attachment://banner.jpg')

        return message.reply({ 
            embeds: [embed],
            files: [attachment]
        })
    }
}

