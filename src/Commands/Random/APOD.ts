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
export const command: Command = {
    name: "apod",
    description: "Check out the Astronomy Picture of the Day",
    details: "Check out the Astronomy Picture of the Day",
    aliases: ["astronomy_picture_of_the_day"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["apod"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;
        //https://api.nasa.gov/
        
        axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`).then((res) => {
            const embed = new MessageEmbed()
                .setTitle(`Astronomy Picture of the Day`)
                .setImage(res.data.hdurl)
                .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                .setTimestamp(Date.now())

            channel.send( {embeds: [embed] });
        }).catch(err => {
            console.log(err);
        })
    }
}


