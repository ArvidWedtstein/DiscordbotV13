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
    examples: ["brawlhallastats {character}"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        let userId = author.id;
        let guildId = guild.id;
        let u = mentions.users.first();
        if (u) {
            args.shift();
            userId = u.id;
        }
        
        profileSchema.findOne({
            userId,
            guildId
        }).then(async(results) => {
            const { steamId } = results;
            let brawlhallaId = results.brawlhallaId;
            

            if (!results) return temporaryMessage(channel, `${u ? `${u.username} does`: 'You do'} not have a profile. Please create one with -profile`, 50);
            if (!steamId || steamId == undefined) return temporaryMessage(channel, `${u ? `${u.username} does`: 'You do'} not have a steam id connected. Please connect your profile to steam with -connectsteam {steamid}`, 50);
            
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
            brawlhallaId = results.brawlhallaId;
            if (!brawlhallaId) return temporaryMessage(channel, `${u ? `${u.username} does`: 'You do'} not have a brawlhalla id connected.`, 50);

            function toCodeBlock(str: any) {
                return `\`${str}\``
            }

            axios.get(`https://api.brawlhalla.com/player/${brawlhallaId}/stats?api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                if (!res.data) return temporaryMessage(channel, 'No results found', 50);
                const { clan, xp, wins, games, level, legends } = res.data;

                let legend;
                if (args[0]) {
                    legend = legends.find((legend: any) => legend.legend_name_key == args[0].toLowerCase());
                    if (!legend) return temporaryMessage(channel, `No legend with that name found`, 50);
                }
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
                    `${legend ? `Stats for ${legend.legend_name_key}` : "**Legend with most:**"}`,
                    `〔Wins: ${toCodeBlock(legend ? legend.wins : `${sortedLegendsWins[0].legend_name_key} - ${sortedLegendsWins[0].wins}`)}〕`,
                    `〔Matchtime: ${toCodeBlock(legend ? `${(legend.matchtime/60).toFixed(2)} min` : `${sortedLegendsMatchtime[0].legend_name_key} - ${(sortedLegendsMatchtime[0].matchtime/60).toFixed(2)} min`)}〕`,
                    `〔Damage Dealt: ${toCodeBlock(legend ? legend.damagedealt : `${sortedLegendsDamageDealt[0].legend_name_key} - ${sortedLegendsDamageDealt[0].damagedealt}`)}〕`,
                    `〔Games played: ${toCodeBlock(legend ? legend.games : `${sortedLegendsGames[0].legend_name_key} - ${sortedLegendsGames[0].games}`)}〕`,
                    `〔Level: ${toCodeBlock(legend ? legend.level : `${sortedLegendsLevel[0].legend_name_key} - ${sortedLegendsLevel[0].level}`)}〕`,
                    `〔XP: ${toCodeBlock(legend ? legend.xp : `${sortedLegendsXP[0].legend_name_key} - ${sortedLegendsXP[0].xp}`)} 〕`,
                    `〔KOs: ${toCodeBlock(legend ? legend.kos : `${sortedLegendsKOs[0].legend_name_key} - ${sortedLegendsKOs[0].kos}`)}〕`,
                    `〔Falls: ${toCodeBlock(legend ? legend.falls : `${sortedLegendsFalls[0].legend_name_key} - ${sortedLegendsFalls[0].falls}`)}〕`
                ]

                const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
    
                let embed = new MessageEmbed()
                    .setColor(client.config.botEmbedHex)
                    .setAuthor({ name: `${u ? u.username : author.username}'s Brawlhalla Stats`, iconURL: `${u ? u.displayAvatarURL() : author.displayAvatarURL()}` })
                    .setDescription(description.join('\n'))
                    .setThumbnail(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLB1letx0NtgkR-wgqOHCsYsISHHfsXepQzjMb3drZA&s`)
                    .setImage('attachment://banner.jpg')
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                return channel.send({ embeds: [embed], files: [attachment] })
            });
        })
    }
}


