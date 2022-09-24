import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

export const command: Command = {
    name: "ban",
    description: "lets you ban a user",
    details: "lets you ban a user from the server",
    group: "Admin",
    UserPermissions: ["BAN_MEMBERS"],
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
        const { guild, author, mentions, channel } = message
        if (!guild) return;

        const setting = await Settings(message, 'moderation');
        
        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Moderation")}`);

        const member = mentions.members?.first();
        if (!member) return ErrorEmbed(message, client, command, "Please mention a user to ban");
        args.shift();
        const days = args[0];

        args.shift();
        const reason = args.join(' ')
        member?.ban({ deleteMessageDays: parseInt(days), reason: reason});
        const embed = new EmbedBuilder()
            .setAuthor({name: `${member?.user.tag}`, iconURL: client.user?.displayAvatarURL()})
            .setDescription(`got banned by ${author.tag} for ${reason} (${days})`)
            .setFooter({ text: `Executed by ${author.tag}` })
            .setTimestamp()
        return channel.send({ embeds: [embed] });
    }
}