import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import profileSchema from '../../schemas/profileSchema';
import axios from 'axios';

export const command: Command = {
    name: "brawlhallastats",
    description: "get your brawlhalla stats",
    details: "get your brawlhalla stats",
    aliases: ["bwlstats"],
    group: "Fun",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["brawlhallastats {steamid}"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        
        profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        }).then(async(results) => {
            if (!results) return temporaryMessage(channel, 'You do not have a profile. Please create one with -profile', 50);
            if (!results.steamId) return temporaryMessage(channel, 'You do not have a steam id. Please connect your profile to steam with -connectsteam {steamid}', 50);
            if (!results.brawlhallaId) return temporaryMessage(channel, 'You do not have a brawlhalla id. Please connect your profile to brawlhalla with -connectbrawlhalla {steamid}', 50);

            const brawlhallaId = results.brawlhallaId;
            const steamId = results.steamId;

            axios.get(`https://api.brawlhalla.com/player/${brawlhallaId}/stats?api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                if (!res.data) return temporaryMessage(channel, 'No results found', 50);
                const { clan, xp, wins, games, level } = res.data;

                let description = [
                    `〔Clan: ${clan.clan_name}〕`,
                    `〔Wins: ${wins}〕`,
                    `〔Games: ${games}〕`,
                    `〔Level: ${level}〕`,
                    `〔XP: ${xp}〕`
                ]
    
                let embed = new MessageEmbed()
                    .setColor(client.config.botEmbedHex)
                    .setDescription(description.join('\n'))
                    .setThumbnail(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLB1letx0NtgkR-wgqOHCsYsISHHfsXepQzjMb3drZA&s`)
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                return channel.send({ embeds: [embed] })
            });
        })
    }
}


