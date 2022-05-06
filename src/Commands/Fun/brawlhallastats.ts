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
            userId = u.id;
            args.shift();
        }
        console.log(userId, author.id)
        profileSchema.findOne({
            userId,
            steamId: {
                $exists: true
            }
            // guildId
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
                args[0].trim()
                if (args[0]) {
                    legend = legends.find((legend: any) => legend.legend_name_key == args[0].toLowerCase());
                    if (!legend) return temporaryMessage(channel, `No legend with that name found`, 50);
                }

                const sort = ((key: string, order = 'asc') => {
                    return function innerSort(a: any, b: any) {
                        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                            return 0;
                        }

                        const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
                        const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

                        let comparison = 0;
                        if (varA > varB) {
                            comparison = 1;
                        } else if (varA < varB) {
                            comparison = -1;
                        }
                        return (
                            (order === 'desc') ? (comparison * -1) : comparison
                        );
                    }
                })
            
            
                

                let TopWins = legends.sort(sort('wins', 'desc'))[0];
                let TopMatchtime = legends.sort(sort('matchtime', 'desc'))[0];
                let TopDamageDealt = legends.sort(sort('damagedealt', 'desc'))[0];
                let TopGames = legends.sort(sort('games', 'desc'))[0];
                let TopLevel = legends.sort(sort('level', 'desc'))[0];
                let TopXP = legends.sort(sort('xp', 'desc'))[0];
                let TopKOs = legends.sort(sort('kos', 'desc'))[0];
                let TopFalls = legends.sort(sort('falls', 'desc'))[0];

                let description = [
                    `〔Clan: ${toCodeBlock(clan.clan_name)}〕`,
                    `〔Wins: ${toCodeBlock(wins)}〕`,
                    `〔Games: ${toCodeBlock(games)}〕`,
                    `〔Level: ${toCodeBlock(level)}〕`,
                    `〔XP: ${toCodeBlock(xp)}〕\n`,
                    `${legend ? `Stats for ${legend.legend_name_key}` : "**Legend with most:**"}`,
                    `〔Wins: ${toCodeBlock(legend ? legend.wins : `${TopWins.legend_name_key} - ${TopWins.wins}`)}〕`,
                    `〔Matchtime: ${toCodeBlock(legend ? `${(legend.matchtime/60).toFixed(2)} min` : `${TopMatchtime.legend_name_key} - ${(TopMatchtime.matchtime/60).toFixed(2)} min`)}〕`,
                    `〔Damage Dealt: ${toCodeBlock(legend ? legend.damagedealt : `${TopDamageDealt.legend_name_key} - ${TopDamageDealt.damagedealt}`)}〕`,
                    `〔Games played: ${toCodeBlock(legend ? legend.games : `${TopGames.legend_name_key} - ${TopGames.games}`)}〕`,
                    `〔Level: ${toCodeBlock(legend ? legend.level : `${TopLevel.legend_name_key} - ${TopLevel.level}`)}〕`,
                    `〔XP: ${toCodeBlock(legend ? legend.xp : `${TopXP.legend_name_key} - ${TopXP.xp}`)} 〕`,
                    `〔KOs: ${toCodeBlock(legend ? legend.kos : `${TopKOs.legend_name_key} - ${TopKOs.kos}`)}〕`,
                    `〔Falls: ${toCodeBlock(legend ? legend.falls : `${TopFalls.legend_name_key} - ${TopFalls.falls}`)}〕`
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


