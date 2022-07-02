import settingsSchema from "../../schemas/settingsSchema";
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
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

        if (!guild) return
        const setting = await Settings(message, 'moderation');
        
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Moderation")}`, 10);
        
        const target = mentions.users.first()

        if (!target || target.bot) return temporaryMessage(channel, 'Please specify someone to warn.', 10);

        
        args.shift()
        const guildId = guild.id
        const userId = target.id
        const reason = args.join(' ')

        if (!member) return

        const warning = {
            author: member.user.tag,
            timestamp: new Date().getTime(),
            reason
        }
        let description = [
            `User: **${target.tag}**`,
            `${insert(guild, 'BAN_REASON', reason)}`
        ].join('\n')

        let embedLogg = new MessageEmbed() 
            .setColor(client.config.botEmbedHex)
            .setDescription(description)
            .setFooter({ text: `Warned by: ${author}`, iconURL: author.displayAvatarURL() })

        await profileSchema.updateOne({
            guildId,
            userId
        }, {
            $push: {
                warns: warning
            },
            // $currentDate: { lastModified: true }
        }).catch((error) => {
            embedLogg.setDescription(`Error while updating profile of user (${target.id})\n${error}`)
            embedLogg.setFooter({ text: `Error occured at: `})
            embedLogg.setTimestamp()
            message.reply({ embeds: [embedLogg] })
            console.log(`Error while updating profile of user (${target.id})\n`, error);
            return 
        })

        // Old Update Profile. (Not used anymore) UpdateOne saves time since findOneAndUpdate returns the document.

        // await profileSchema.findOneAndUpdate({
        //     guildId,
        //     userId
        // }, {
        //     $push: {
        //         warns: warning
        //     }
        // }).catch((error) => {
        //     embedLogg.setDescription(`Error while updating profile of user (${target.id})\n${error}`)
        //     embedLogg.setFooter({ text: `Error occured at: `})
        //     embedLogg.setTimestamp()
        //     message.reply({ embeds: [embedLogg] })
        //     console.log(`Error while updating profile of user (${target.id})\n`, error);
        //     return 
        // })
        target.send({ embeds: [embedLogg] })
    }
}
