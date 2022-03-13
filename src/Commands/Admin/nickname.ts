import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "nickname",
    description: "nickname a user",
    aliases: ["nick"],
    group: __dirname,
    UserPermissions: ["KICK_MEMBERS"],
    run: async(client, message, args) => {
        message.delete()
        const { guild, author, mentions } = message
        if (!guild) return;
        const guildId = guild?.id
        const setting = await Settings(message, 'moderation');

        if (!setting) return message.reply(`${await language(guild, 'SETTING_OFF')} Moderation ${await language(guild, 'SETTING_OFF2')}`);
        
        const target = mentions.users.first();
        args.shift();
        if(!target) return message.reply(`${language(guild, 'VALID_USER')}`);
        const member = guild.members.cache.get(target.id);
        
        let embed = new MessageEmbed()
            .setAuthor({ name: `${author.username} nicknamed`, iconURL: `${author.displayAvatarURL()}` })
            .setFooter({ text: `${member?.user.username} to ${args.join(' ')}` })
        message.reply({ embeds: [embed] })

        member?.setNickname(args.join(' '), 'YES');
        
    }
}