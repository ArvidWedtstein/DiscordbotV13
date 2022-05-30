import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { cacheSetTTL, cacheSet } from '../../Functions/CacheClient'
import NasaAPIcacheSchema from '../../schemas/24hAPIcacheSchema';
export const command: Command = {
    name: "currentweek",
    description: "Get the current week of the year",
    details: "Get the current week of the year",
    aliases: ["week", "calendar"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["currentweek"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;
        
        if (!guild) return
        
        let currentDate: any = new Date();
        let startDate: any = new Date(currentDate.getFullYear(), 0, 1);
        let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
            
        var weekNumber = Math.ceil(days / 7);
        
        
        const embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setTitle(`Current Week Of The Year`)
            .setDescription(`The current week of the year is **${weekNumber}**`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        message.reply( {embeds: [embed] });
    }
}


