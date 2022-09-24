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
    name: "dice",
    description: "roll a dice",
    details: "roll a dice",
    aliases: ["terning"],
    group: "Fun",
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["dice"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        function getRandomIntInclusive(min: number, max: number) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        const emoji = client.emojis.cache.get('862437381684330597')
        let embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setTitle(`${emoji} You rolled a ***${getRandomIntInclusive(1, 6)}***`)
            .setFooter({ text: `Dice rolled by ${author.tag}`, iconURL: author.displayAvatarURL() })
        await channel.send({ embeds: [embed] })
        
    }
}


