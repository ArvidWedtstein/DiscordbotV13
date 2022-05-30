import { Client, Message, MessageAttachment, MessageEmbed, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import reactionRoleSchema from "../schemas/reactionRoleSchema";


const cache: any = {}

export const fetchCache = (guildId: string) => cache[guildId] || []

export const addToCache = async (guildId: string, message: Message, emoji?: any, roleId?: string) => {
    const array = cache[guildId] || [ message, {}]

    if (emoji && roleId) {
        array[1][emoji] = roleId
    }

    // if (!message) return await reactionRoleSchema.deleteOne({ guildId: guildId })
    await message.channel.messages.fetch(message.id, {
        cache: true,
        force: true
    })

    cache[guildId] = array
} 

const handleReaction = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, adding: boolean) => {
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
    const { message } = reaction
    const { guild } = message

    if (!guild) return

    const [fetchedMessage, roles] = fetchCache(guild.id)
    if (!fetchedMessage) {
        return
    }

    if (fetchedMessage.id === message.id && guild.me?.permissions.has('MANAGE_ROLES')) {
        const toCompare = reaction.emoji.id || reaction.emoji.name

        for (const key of Object.keys(roles)) {
            if (key === toCompare) {
                const role = guild.roles.cache.get(roles[key])
                if (role) {
                    const member = guild.members.cache.get(user.id)

                    if (!member) return
                
                    adding ? member.roles.add(role) : member.roles.remove(role)
                }
                return
            }
        }
    }
}
export default async (client: Client) => {
    client.on("messageReactionAdd", (reaction, user) => {
        handleReaction(reaction, user, true)
    })   
    client.on("messageReactionRemove", (reaction, user) => {
        handleReaction(reaction, user, false)
    })   

    const results = await reactionRoleSchema.find()

    for (const result of results) {
        const { guildId, channelId, messageId, roles } = result

        const guild = await client.guilds.cache.get(guildId)

        if (!guild) return await reactionRoleSchema.deleteOne({ guildId })

        const channel = await guild.channels.cache.get(channelId)

        // Delete reactionRole document if the channel no longer exists
        if (!channel || !channel.isText()) return await reactionRoleSchema.deleteOne({ channelId })
        
        try {
            const cacheMessage = true
            const skipCache = true
            const fetchedMessage = await channel.messages.fetch(messageId, {
                cache: cacheMessage,
                force: skipCache
            })

            if (fetchedMessage) {
                const newRoles: any = {}

                for (const role of roles) {
                    const { emoji, roleId } = role
                    newRoles[emoji] = roleId
                }

                cache[guildId] = [fetchedMessage, newRoles]
            }
        } catch (e) {
            await reactionRoleSchema.deleteOne({ messageId })
        }
    }
}