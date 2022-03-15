import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import { addToCache, fetchCache } from '../../Functions/reactions';
import reactionRoleSchema from '../../schemas/reactionRoleSchema';

export const command: Command = {
    name: "ping",
    description: "check my ping",
    details: "Check the ping of this bot.",
    aliases: ["memeping"],
    group: "Guild",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["ping"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        let emoji: any = args.shift()
        let role: any = args.shift()
        const displayName = args.join(' ')

        if (!role) return temporaryMessage(channel, `No role specified`, 5)

        if (role.startsWith('<@&')) {
            role = role.substring(3, role.length - 1)
        }

        const newRole = guild.roles.cache.find(r => {
            return r.name === role || r.id === role
        }) || null

        if (!newRole) return temporaryMessage(channel, `Could not find a role for "${role}"`, 10)

        role = newRole

        if (emoji.includes(':')) {
            const emojiName = emoji.split(':')[1]
            emoji = guild.emojis.cache.find(e => {
                return e.name === emojiName
            })
        }
        const [fetchedMessage] = fetchCache(guild.id)

        if (!fetchedMessage) {
            message.reply(`error`)
            return
        }

        const newLine = `${emoji} ${displayName}`
        let { content } = fetchedMessage

        if (content.includes(emoji)) {
            const split = content.split('\n')

            for (let a = 0; a < split.length; a++) {
                if (split[a].includes(emoji)) {
                    split[a] = newLine
                }
            }
            content = split.join('\n')
        } else {
            content += `\n${newLine}`
            fetchedMessage.react(emoji)
        }

        fetchedMessage.edit(content)

        const obj = {
            guildId: guild.id,
            channelId: fetchedMessage.channel.id,
            messageId: fetchedMessage.id
        }

        await reactionRoleSchema.findOneAndUpdate(obj, {
            ...obj,
            $addToSet: {
                roles: {
                    emoji,
                    roleId: role.id
                }
            }
        }, {
            upsert: true
        })
        addToCache(guild.id, fetchedMessage, emoji, role.id)
        
    }
}