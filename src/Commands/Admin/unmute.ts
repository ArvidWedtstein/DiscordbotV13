import { EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import language, { insert } from '../../Functions/language';
import { Settings } from '../../Functions/settings';
import { Command } from '../../Interfaces';
import muteSchema from '../../schemas/muteSchema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

export const command: Command = {
    name: "unmute",
    description: "unmute a user",
    aliases: ["removemute"],
    group: __dirname.toLowerCase(),
    UserPermissions: [
        'SendMessages',
        'AddReactions',
        'MuteMembers'
    ],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel'
    ],
    run: async(client, message, args) => {
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const setting = await Settings(message, 'moderation');

        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Moderation")}`);
        
        
        if (args.length !== 1) return ErrorEmbed(message, client, command, `${language(guild, 'VALID_USER')}`); 

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