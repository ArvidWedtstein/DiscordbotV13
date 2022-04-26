import { MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import language, { insert } from '../../Functions/language';
import { Settings } from '../../Functions/settings';
import { Command } from '../../Interfaces';
import muteSchema from '../../schemas/muteSchema';

export const command: Command = {
    name: "unmute",
    description: "unmute a user",
    aliases: ["removemute"],
    group: __dirname.toLowerCase(),
    UserPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'MUTE_MEMBERS'
    ],
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL'
    ],
    run: async(client, message, args) => {
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const setting = await Settings(message, 'moderation');

        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Moderation")}`, 10);
        
        
        if (args.length !== 1) return message.reply(`Please use the correct syntax: ${client.config.prefix}unmute <Target user\'s @ OR their ID>`)

        let id = ''

        const target = mentions.users.first()
        if (target) {
            id = target.id
        } else {
            id = args[0]
        }

        const result = await muteSchema.updateOne({
            guildId: guild.id,
            userId: id,
            current: true,
        }, {
            current: false,
        })
        
        // Remove Muted Role
        const mutedRole = guild.roles.cache.find(role => {
            return role.name === 'Muted'
        })
        if (mutedRole) {
            const guildMember = guild.members.cache.get(id)
            guildMember?.roles.remove(mutedRole)
        }
        message.reply(`Unmuted <@${id}>`)
    }
}