import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';

export const command: Command = {
    name: "ping",
    description: "check my ping",
    details: "Check the ping of this bot.",
    aliases: ["memeping"],
    group: "Guild",
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["ping"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        const embed = new EmbedBuilder()
            .setAuthor({name: `Ping is currently ${client.ws.ping.toString()}`, iconURL: client.user?.displayAvatarURL()})
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        channel.send({ embeds: [embed] });
        
    }
}