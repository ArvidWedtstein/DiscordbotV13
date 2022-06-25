import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import profileSchema from '../../schemas/profileSchema';
import axios from 'axios';
import brawlhallalegends from '../../brawlhallalegends.json';

export const command: Command = {
    name: "brawlhallarewards",
    description: "get your brawlhalla rewards",
    details: "get your brawlhalla rewards",
    aliases: ["bwlrewards"],
    group: "Fun",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL'
    ],
    ownerOnly: true,
    examples: ["brawlhallarewards"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        let userId = author.id;
        let guildId = guild.id;


        profileSchema.findOne({
            userId,
            steamId: {
                $exists: true,
                $ne: null
            }
            // guildId
        }).then(async(results) => {
            
            
            if (!results) return temporaryMessage(channel, `You do not have a profile. Please create one with -profile`, 50);
            if (!results.steamId || results.steamId == undefined) return temporaryMessage(channel, `You do not have a steam id connected. Please connect your profile to steam with -connectsteam {steamid}`, 50);
            let { steamId, brawlhallaId } = results;
            
            if (!brawlhallaId && steamId) {
                try {
                    axios.get(`https://api.brawlhalla.com/search?steamid=${steamId}&api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                        if (!res.data.brawlhalla_id) return temporaryMessage(channel, `This user not have a brawlhalla id`, 50);
                        if (res.data.brawlhalla_id) {
                            results.brawlhallaId = res.data.brawlhalla_id;
                            brawlhallaId = res.data.brawlhalla_id;
                            results.save();
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
            }


            if (!brawlhallaId) return temporaryMessage(channel, `You do not have a brawlhalla id connected. `, 50);

            function toCodeBlock(str: any) {
                return `\`${str}\``
            }

            let embed = new MessageEmbed()
                .setColor(client.config.botEmbedHex)
                .setTitle(`${author.username}'s Brawlhalla Rewards`)
                .setURL(`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${message.url}&scope=channel%3Aread%3Aredemptions`)
        })
    }
}


