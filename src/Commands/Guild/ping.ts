import { Command } from '../../Interfaces';
import { Settings } from '../../settings';
import * as gradient from 'gradient-string';
import language from '../../language';
import { addCoins, setCoins, getCoins, getColor } from '../../economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "ping",
    run: async(client, message, args) => {
        const embed = new MessageEmbed()
            .setAuthor({name: `Ping is currently ${client.ws.ping.toString()}`, iconURL: client.user?.displayAvatarURL()})
            .setFooter({ text: `Requested by ${message.author.tag}`})
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}