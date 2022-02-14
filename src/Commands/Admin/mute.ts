import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: "mute",
    description: "mute a user",
    run: async(client, message, args) => {
        const user = message.mentions.users.first();
        const length: number = parseInt(args[1]);
        const reason: string = args.slice(2, args.length-1).join(' ');
        if (!user) return message.reply("Please tag a user");
        if (!length) return message.reply("Please provide a length of the timeout");
        if (!reason) return message.reply("Please provide a reason");
        const member = message.guild?.members.cache.get(user.id)
        member?.timeout(length*1000, reason);
        const embed = new MessageEmbed()
        .setTitle("Mute")
        .setDescription(`${user.username} was given a **${length}** timeout for **${reason}**`)
        .setFooter({ text: "Today at " })
        .setTimestamp()
        message.reply({embeds: [embed]})
    }
}