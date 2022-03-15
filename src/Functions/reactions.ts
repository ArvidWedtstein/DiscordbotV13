import { Client, Message } from "discord.js"

const reactionSchema = require('../../schemas/reaction-roles-schema')

const cache: any = {}

export const fetchCache = (guildId: any) => cache[guildId] || []

export const addToCache = async (guildId: any, message: Message, emoji: any, roleId: any) => {
    const array = cache[guildId] || [ message, {}]

    if (emoji && roleId) {
        array[1][emoji] = roleId
    }

    await message.channel.messages.fetch(message.id)

    cache[guildId] = array
} 

const handleReaction = (reaction: any, user: any, adding: any) => {
    const { message } = reaction
    const { guild } = message

    const [fetchedMessage, roles] = fetchCache(guild.id)
    if (!fetchedMessage) {
        return
    }
    if (fetchedMessage.id === message.id && guild.me.hasPermission('MANAGE_ROLES')) {
        const toCompare = reaction.emoji.id || reaction.emoji.name

        for (const key of Object.keys(roles)) {
            if (key === toCompare) {
                const role = guild.roles.cache.get(roles[key])
                if (role) {
                    const member = guild.members.cache.get(user.id)

                    if (adding) {
                        member.roles.add(role)
                    } else {
                        member.roles.remove(role)
                    }
                }
                return
            }
        }
    }
}

export default async (client: Client) => {
    client.on('messageReactionAdd', (reaction, user) => {
        handleReaction(reaction, user, true)
    })
    client.on('messageReactionRemove', (reaction, user) => {
        handleReaction(reaction, user, false)
    })

    const results = await reactionSchema.find()

    for (const result of results) {
        const { guildId, channelId, messageId, roles } = result

        const guild = await client.guilds.cache.get(guildId)

        if (!guild) {
            await reactionSchema.deleteOne({ guildId })
            return
        }

        const channel = await guild.channels.cache.get(channelId)

        if (!channel || !channel.isText()) return await reactionSchema.deleteOne({ channelId })

        try {
            const fetchedMessage = await channel?.messages?.fetch(messageId)

            if (fetchedMessage) {
                const newRoles: any = {}

                for (const role of roles) {
                    const { emoji, roleId } = role
                    newRoles[emoji] = roleId
                }

                cache[guildId] = [fetchedMessage, newRoles]
            }
        } catch (e) {
            await reactionSchema.deleteOne({ messageId })
        }
    }
}

