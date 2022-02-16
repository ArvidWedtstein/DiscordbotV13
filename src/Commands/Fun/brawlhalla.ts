// brawlhallaID Arvid: 55760461
//https://dev.brawlhalla.com/#rate-limit
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "brawlhallaapi",
    description: "brawlhallaapi",
    details: "brawlhallaapi",
    aliases: ["brawlhallaapi"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["brawlhallaapi"],
    
    run: async(client, message, args) => {
        const embed = new MessageEmbed()
            .setAuthor({name: `Ping is currently ${client.ws.ping.toString()}`, iconURL: client.user?.displayAvatarURL()})
            .setFooter({ text: `Requested by ${message.author.tag}`})
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}