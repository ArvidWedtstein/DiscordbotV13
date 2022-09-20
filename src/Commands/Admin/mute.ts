import { EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import language, { insert } from '../../Functions/language';
import { Settings } from '../../Functions/settings';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: "mute",
    description: "mute a user",
    group: __dirname.toLowerCase(),
    UserPermissions: ["MUTE_MEMBERS"],
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
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Moderation")}`, 10);
        
        const user = mentions.users.first();
        const length: number = parseInt(args[1]);
        const reason: string = args.slice(2, args.length-1).join(' ');
        if (!user) return message.reply("Please tag a user");
        if (!length) return message.reply("Please provide a length of the timeout");
        if (!reason) return message.reply("Please provide a reason");
        const member = guild.members.cache.get(user.id)
        member?.timeout(length*1000, reason);
        const embed = new EmbedBuilder()
            .setTitle("Mute")
            .setDescription(`${user.username} was given a **${length}** timeout for **${reason}**`)
            .setFooter({ text: "Today at " })
            .setTimestamp()
        message.reply({embeds: [embed]})
    }
}