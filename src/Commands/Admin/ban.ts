import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
export const command: Command = {
    name: "ban",
    group: "Admin",
    UserPermissions: [
        "BAN_MEMBERS"
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
        const guildId = guild?.id
        const setting = await Settings(message, 'moderation');

        if (!setting) return message.reply(`${await language(guild, 'SETTING_OFF')} Moderation ${await language(guild, 'SETTING_OFF2')}`);

        const member = mentions.members?.first();
        if (!member) return message.reply('couldnt find member')
        args.shift();
        const days = args[0];
        console.log('ban')
        args.shift();
        const reason = args.join(' ')
        member?.ban({days: parseInt(days), reason: reason});
        const embed = new MessageEmbed()
            .setAuthor({name: `${member?.user.tag}`, iconURL: client.user?.displayAvatarURL()})
            .setDescription(`got banned by ${author.tag} for ${reason} (${days})`)
            .setFooter({ text: `Executed by ${author.tag}` })
            .setTimestamp()
        channel.send({embeds: [embed]});
    }
}