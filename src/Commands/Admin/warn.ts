import settingsSchema from "../../schemas/settingsSchema";
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from "../../schemas/profileSchema";
import { ErrorEmbed } from "../../Functions/ErrorEmbed";
export const command: Command = {
    name: "warn",
    description: "warn a user",
    details: "warn",
    aliases: ["advarsel"],
    group: __dirname.toLowerCase(),
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel',
        'BanMembers'
    ],
    ownerOnly: false,
    examples: ["warn @user <reason>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;

        if (!guild) return
        const setting = await Settings(message, 'moderation');

        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Moderation")}`);
        
        const target = mentions.users.first()

        if (!target || target.bot) return ErrorEmbed(message, client, command, 'Please specify someone to warn.');

        
        args.shift()
        const guildId = guild.id
        const userId = target.id
        const reason = args.join(' ')

        if (!member) return

        const warns = {
            author: member.user.tag,
            timestamp: new Date().getTime(),
            reason
        }
        let description = [
            `User: **${target.tag}**`,
            `${insert(guild, 'BAN_REASON', reason)}`
        ].join('\n')

        let embedLogg = new EmbedBuilder() 
            .setColor(client.config.botEmbedHex)
            .setDescription(description)
            .setFooter({ text: `Warned by: ${author}`, iconURL: author.displayAvatarURL() })

        await profileSchema.updateOne({
            guildId,
            userId
        }, {
            $push: {
                warns
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

        target.send({ embeds: [embedLogg] })
    }
}
