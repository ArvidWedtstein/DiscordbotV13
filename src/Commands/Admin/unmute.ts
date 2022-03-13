import { MessageEmbed } from 'discord.js';
import language from '../../Functions/language';
import { Settings } from '../../Functions/settings';
import { Command } from '../../Interfaces';
import muteSchema from '../../schemas/muteSchema';

export const command: Command = {
    name: "unmute",
    description: "unmute a user",
    aliases: ["removemute"],
    group: __dirname.toLowerCase(),
    run: async(client, message, args) => {
        const { guild, author, mentions } = message
        if (!guild) return;
        const setting = await Settings(message, 'moderation');

        if (!setting) return message.reply(`${await language(guild, 'SETTING_OFF')} Moderation ${await language(guild, 'SETTING_OFF2')}`);
        
        
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