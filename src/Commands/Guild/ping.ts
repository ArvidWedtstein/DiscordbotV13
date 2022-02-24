import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "ping",
    description: "check my ping",
    details: "Check the ping of this bot.",
    aliases: ["memeping"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["ping"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;
        const embed = new MessageEmbed()
            .setAuthor({name: `Ping is currently ${client.ws.ping.toString()}`, iconURL: client.user?.displayAvatarURL()})
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}