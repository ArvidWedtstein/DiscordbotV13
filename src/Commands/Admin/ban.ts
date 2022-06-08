import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "ban",
    description: "lets you ban a user",
    details: "lets you ban a user from the server",
    group: "Admin",
    UserPermissions: ["BAN_MEMBERS"],
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
        
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Moderation")}`);

        const member = mentions.members?.first();
        if (!member) return message.reply('couldnt find member')
        args.shift();
        const days = args[0];

        args.shift();
        const reason = args.join(' ')
        member?.ban({days: parseInt(days), reason: reason});
        const embed = new MessageEmbed()
            .setAuthor({name: `${member?.user.tag}`, iconURL: client.user?.displayAvatarURL()})
            .setDescription(`got banned by ${author.tag} for ${reason} (${days})`)
            .setFooter({ text: `Executed by ${author.tag}` })
            .setTimestamp()
        channel.send({ embeds: [embed] });
    }
}