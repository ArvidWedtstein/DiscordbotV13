import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import { addXP, getXP, getLevel } from '../../Functions/Level';
import brawlhallalegends from '../../brawlhallalegends.json';
import moment from 'moment';
import axios from 'axios';
export const command: Command = {
    name: "brawlhallalegend",
    description: "See description of a brawlhalla legend",
    details: "See description of a brawlhalla legend",
    aliases: ["bwllegend"],
    ownerOnly: false,
    ClientPermissions: ["SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "VIEW_CHANNEL"],
    UserPermissions: ["SEND_MESSAGES"],
    examples: [`${process.env.PREFIX}brawlhallalegend {legend name}`],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;

        if (!guild) return;

        let legend = args.join(' ').toLowerCase();

        if (!legend) return temporaryMessage(channel, 'Please provide a legend name', 10);


        const chosenlegend = brawlhallalegends.find((legend: any) => legend.legend_name_key === legend);

        if (!chosenlegend) return temporaryMessage(channel, 'That legend does not exist', 10);
        
        // const embed = new MessageEmbed()
        //     .setColor(client.config.botEmbedHex)
        //     .setTitle(`${chosenlegend.legend_name_key}`)
        //     .setDescription(`${chosenlegend.legend_description}`)
        //     .setThumbnail(`https://brawlhalla.com/static/images/legends/${chosenlegend.legend_name_key}.png`)
        //     .setTimestamp()
        //     .setFooter(`Requested by ${author.username}`, author.displayAvatarURL());
            

        
        // Use static data instead of sending api request every time command is used
        // try {
        //     axios.get(`https://api.brawlhalla.com/legend/all/?api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
        //         if (!res.data.length || !res.data) return
        //     });
        // } catch (e) {
        //     console.log(e);
        // }

        
    }
}