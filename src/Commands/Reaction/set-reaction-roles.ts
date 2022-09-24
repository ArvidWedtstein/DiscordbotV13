import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import { addToCache, fetchCache } from '../../Functions/ReactionRole';
import reactionRoleSchema from '../../schemas/reactionRoleSchema';

export const command: Command = {
    name: "setreactionroles",
    description: "setreactionroles",
    details: "setreactionroles",
    aliases: ["set_reaction_roles", "setreactionrole"],
    group: "Reaction",
    hidden: false,
    UserPermissions: ["SendMessages", "MANAGE_CHANNELS"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["setreactionroles {emoji} {role} {Name (Optional)}"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        let emoji: any = args.shift();
        let role: any = args.shift();
        let displayName = args.join(' ');

        if (message.deletable) message.delete();

        if (!role) return temporaryMessage(channel, `No role specified`, 15);

        if (role.startsWith('<@&')) {
            role = role.substring(3, role.length - 1);
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

        if (!fetchedMessage) return

        const newLine = `${emoji} - ${displayName.trim().length > 0 ? displayName : role.name}`

        let { content, embeds } = fetchedMessage

        if (embeds.length > 0) {
            const attachment = new AttachmentBuilder('./img/banner.jpg');
            let embed = new EmbedBuilder(embeds[0])

            let { description } = embed.data

            if (!description) return

            if (description.includes(emoji)) {
                const lines = description.split('\n');

                for (let a = 0; a < lines.length; a++) {
                    if (lines[a].includes(emoji)) {
                        lines[a] = newLine
                    }
                }
                embed.setDescription(lines.join('\n'))
            } else {
                description += `\n${newLine}`
                fetchedMessage.react(emoji)
            }
            embed.setDescription(description)
            fetchedMessage.edit({ embeds: [embed] })
        } else {
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
        }

        const obj = {
            guildId: guild.id,
            channelId: fetchedMessage.channel.id,
            messageId: fetchedMessage.id
        }

        await reactionRoleSchema.findOneAndUpdate(obj, {
            ...obj,
            $addToSet: {
                roles: {
                    emoji: emoji,
                    roleId: role.id
                }
            }
        }, {
            upsert: true
        })
        addToCache(guild.id, fetchedMessage, emoji, role.id)
    }
}