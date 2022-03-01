import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
export const command: Command = {
    name: "ban",
    group: "",
    run: async(client, message, args) => {
        const member = message.mentions.members?.first();
        if (!member) return message.reply('couldnt find member')
        args.shift();
        const days = args[0];
        console.log('ban')
        args.shift();
        const reason = args.join(' ')
        member?.ban({days: parseInt(days), reason: reason});
        const embed = new MessageEmbed()
            .setAuthor({name: `${member?.user.tag}`, iconURL: client.user?.displayAvatarURL()})
            .setDescription(`got banned by ${message.author.tag} for ${reason} (${days})`)
            .setFooter({ text: `Executed by ${message.author.tag}` })
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}