import settingsSchema from "../../schemas/settingsSchema";
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from "../../schemas/profileSchema";
export const command: Command = {
    name: "warn",
    description: "warn a user",
    details: "warn",
    aliases: ["advarsel"],
    group: __dirname.toLowerCase(),
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL',
        'BAN_MEMBERS'
    ],
    ownerOnly: false,
    examples: ["warn @user <reason>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;
        message.delete()
        const setting = await Settings(message, 'moderation');
        
        if (!setting) return temporaryMessage(channel, 'Cannot use this command. Moderation is turned off', 10);
        
        const target = mentions.users.first()
        if (!target || target.bot) return temporaryMessage(channel, 'Please specify someone to warn.', 10);

        
        args.shift()
        const guildId = guild?.id
        const userId = target.id
        const reason = args.join(' ')


        const warning = {
            author: member?.user.tag,
            timestamp: new Date().getTime(),
            reason
        }

        let embedLogg = new Discord.MessageEmbed() 
            .setColor('AQUA')
            .addField('User: ', `${target.username}`)
            .addField(`${language(guild, 'BAN_REASON')}: `, `${reason}`)
            .addField('Warned by: ', `${author}`)
        target.send({ embeds: [embedLogg] })

        await profileSchema.findByIdAndUpdate({
            guildId,
            userId
        }, {
            $push: {
                warns: warning
            }
        }).catch((error) => {
            console.log(`Error while updating profile of user (${target.id})\n`, error);
        })
    }
}
