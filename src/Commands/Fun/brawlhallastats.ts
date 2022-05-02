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

            function toCodeBlock(str: any) {
                return `\`${str}\``
            }

            axios.get(`https://api.brawlhalla.com/player/${brawlhallaId}/stats?api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                if (!res.data) return temporaryMessage(channel, 'No results found', 50);
                const { clan, xp, wins, games, level, legends } = res.data;

                let sortedLegendsWins = legends.sort((a: any, b: any) => {
                    return b.wins - a.wins;
                });
                let sortedLegendsMatchtime = legends.sort((a: any, b: any) => {
                    return b.matchtime - a.matchtime;
                });
                let sortedLegendsDamageDealt = legends.sort((a: any, b: any) => {
                    return b.damagedealt - a.damagedealt;
                });
                let sortedLegendsGames = legends.sort((a: any, b: any) => {
                    return b.games - a.games;
                });
                let sortedLegendsLevel = legends.sort((a: any, b: any) => {
                    return a.level - b.level;
                });
                let sortedLegendsXP = legends.sort((a: any, b: any) => {
                    return b.xp - a.xp;
                });
                let sortedLegendsKOs = legends.sort((a: any, b: any) => {
                    return b.kos - a.kos;
                });
                let sortedLegendsFalls = legends.sort((a: any, b: any) => {
                    return b.falls - a.falls;
                });
                
                let description = [
                    `〔Clan: ${toCodeBlock(clan.clan_name)}〕`,
                    `〔Wins: ${toCodeBlock(wins)}〕`,
                    `〔Games: ${toCodeBlock(games)}〕`,
                    `〔Level: ${toCodeBlock(level)}〕`,
                    `〔XP: ${toCodeBlock(xp)}〕\n`,
                    `**Legend with most:**`,
                    `〔wins: ${toCodeBlock(sortedLegendsWins[0].legend_name_key)} - ${toCodeBlock(sortedLegendsWins[0].wins)}〕`,
                    `〔matchtime: ${toCodeBlock(sortedLegendsMatchtime[0].legend_name_key)} - ${toCodeBlock(sortedLegendsMatchtime[0].matchtime)}〕`,
                    `〔Damage Dealt: ${toCodeBlock(sortedLegendsDamageDealt[0].legend_name_key)} - ${toCodeBlock(sortedLegendsDamageDealt[0].matchtime)}〕`,
                    `〔Games played: ${toCodeBlock(sortedLegendsGames[0].legend_name_key)} - ${toCodeBlock(sortedLegendsGames[0].games)}〕`,
                    `〔level: ${toCodeBlock(sortedLegendsLevel[0].legend_name_key)} - ${toCodeBlock(sortedLegendsLevel[0].level)}〕`,
                    `〔XP: ${toCodeBlock(sortedLegendsXP[0].legend_name_key)} - ${toCodeBlock(sortedLegendsXP[0].xp)}〕`,
                    `〔KOs: ${toCodeBlock(sortedLegendsKOs[0].legend_name_key)} - ${toCodeBlock(sortedLegendsKOs[0].kos)}〕`,
                    `〔Falls: ${toCodeBlock(sortedLegendsFalls[0].legend_name_key)} - ${toCodeBlock(sortedLegendsFalls[0].falls)}〕`
                ]

                const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
    
                let embed = new MessageEmbed()
                    .setColor(client.config.botEmbedHex)
                    .setAuthor({ name: `${author.username}'s Brawlhalla Stats`, iconURL: author.displayAvatarURL() })
                    .setDescription(description.join('\n'))
                    .setThumbnail(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLB1letx0NtgkR-wgqOHCsYsISHHfsXepQzjMb3drZA&s`)
                    .setImage('attachment://banner.jpg')
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                return channel.send({ embeds: [embed], files: [attachment] })
            });
        })
    }
}


