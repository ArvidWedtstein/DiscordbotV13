import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "nickname",
    description: "nickname a user",
    aliases: ["nick"],
    group: __dirname,
    UserPermissions: ["MANAGE_NICKNAMES"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'ATTACH_FILES',
        'EmbedLinks',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'ViewChannel'
    ],
    run: async(client, message, args) => {
        message.delete()
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const guildId = guild?.id
        const setting = await Settings(message, 'moderation');

        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Moderation")}`);
        
        const target = mentions.users.first();
        args.shift();
        if(!target) return message.reply(`${language(guild, 'VALID_USER')}`);
        const member = guild.members.cache.get(target.id);
        
        let embed = new EmbedBuilder()
            .setAuthor({ name: `${author.username} nicknamed`, iconURL: `${author.displayAvatarURL()}` })
            .setFooter({ text: `${member?.user.username} to ${args.join(' ')}` })
        message.reply({ embeds: [embed] })

        member?.setNickname(args.join(' '), 'YES');
        
    }
}