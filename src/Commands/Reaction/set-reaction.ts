import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import { addToCache, fetchCache } from '../../Functions/ReactionRole';
import reactionRoleSchema from '../../schemas/reactionRoleSchema';

export const command: Command = {
    name: "setreaction",
    description: "setreaction",
    details: "setreaction",
    aliases: ["set_reaction", "set-reaction"],
    group: "Reaction",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "MANAGE_CHANNELS", "ADD_REACTIONS", "MANAGE_ROLES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["setreaction {channel} {message}"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        message.delete()
        const { channels } = mentions
        const targetChannel = channels.first() || channel

        if (!targetChannel.isText()) return

        if (channels.first()) args.shift()

        const text = args.join(' ')

        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

        const embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ name: ``, iconURL: guild.iconURL() || author.defaultAvatarURL })
            .setDescription(`**${text}**\n`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `React to one (or multiple) emojis below to recieve your role` })

        const newMessage = await targetChannel.send({ embeds: [embed], files: [attachment] })

        addToCache(guild.id, newMessage)

        new reactionRoleSchema({
            guildId: guild.id,
            channelId: targetChannel.id,
            messageId: newMessage.id,
        }).save()
        .catch(() => {
            temporaryMessage(channel, 'Failed to save to the database', 30)
        })
    }
}