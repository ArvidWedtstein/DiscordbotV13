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
import { CustomCanvas, Icon } from '../../Functions/Canvas'
import { readFile } from 'fs';

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

        profileSchema.findOne({
            userId,
            steamId: {
                $exists: true,
                $ne: null
            }
            // guildId
        }).then(async(results) => {
            
            
            if (!results) return temporaryMessage(channel, `${u ? `${u.username} does`: 'You do'} not have a profile. Please create one with -profile`, 50);
            if (!results.steamId || results.steamId == undefined) return temporaryMessage(channel, `${u ? `${u.username} does`: 'You do'} not have a steam id connected. Please connect your profile to steam with -connectsteam {steamid}`, 50);
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


            if (!brawlhallaId) return temporaryMessage(channel, `${u ? `${u.username} does`: 'You do'} not have a brawlhalla id connected. `, 50);

            function toCodeBlock(str: any) {
                return `\`${str}\``
            }

            const sort = ((key: string, order = 'asc') => {
                return function innerSort(a: any, b: any) {
                    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                        return 0;
                    }

                    // Check if number is in a string
                    if (typeof a[key] === 'string' && !isNaN(parseFloat(a[key]))) a[key] = parseFloat(a[key]);
                    if (typeof a[key] === 'string' && !isNaN(parseFloat(b[key]))) b[key] = parseFloat(b[key]);
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


            axios.get(`https://api.brawlhalla.com/player/${brawlhallaId}/stats?api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                if (!res.data) return temporaryMessage(channel, 'No results found', 50);
                const { clan, xp, wins, games, level, legends } = res.data;

                const sum = legends.reduce((accumulator: any, object: any) => {
                    return accumulator + object.matchtime;
                }, 0);

                let description = [
                    `〔Clan: ${toCodeBlock(clan.clan_name)}〕`,
                    `〔Wins: ${toCodeBlock(wins)}〕`,
                    `〔Games: ${toCodeBlock(games)}〕`,
                    `〔Level: ${toCodeBlock(level)}〕`,
                    `〔XP: ${toCodeBlock(xp)}〕`,
                    `〔Total Matchtime: ${toCodeBlock(`${((sum/60) / 60).toFixed(2)} hours`)}〕\n`
                ]


                // If user has specified a legend
                if (args[0]) {
                    let legend = legends.find((legend: any) => legend.legend_name_key == args[0].toLowerCase().trim());

                    if (!legend) return temporaryMessage(channel, `No legend with that name found`, 50);
                    
                    description = description.concat([
                        `${legend ? `Stats for ${legend.legend_name_key}` : "**Legend with most:**"}`,
                        `〔Wins: ${toCodeBlock(legend.wins)}〕`,
                        `〔Matchtime: ${toCodeBlock(`${((legend.matchtime/60) / 60).toFixed(2)} hours`)}〕`,
                        `〔Damage Dealt: ${toCodeBlock(legend.damagedealt)}〕`,
                        `〔Games played: ${toCodeBlock(legend.games)}〕`,
                        `〔Level: ${toCodeBlock(legend.level)}〕`,
                        `〔XP: ${toCodeBlock(legend.xp)} 〕`,
                        `〔KOs: ${toCodeBlock(legend.kos)}〕`,
                        `〔Falls: ${toCodeBlock(legend.falls)}〕`
                    ])
                } else {
                    let TopWins = legends.sort(sort('wins', 'desc'))[0];
                    let TopMatchtime = legends.sort(sort('matchtime', 'desc'))[0];
                    let TopDamageDealt = legends.sort(sort('damagedealt', 'desc'))[0];
                    let TopGames = legends.sort(sort('games', 'desc'))[0];
                    let TopLevel = legends.sort(sort('level', 'desc'))[0];
                    let TopXP = legends.sort(sort('xp', 'desc'))[0];
                    let TopKOs = legends.sort(sort('kos', 'desc'))[0];
                    let TopFalls = legends.sort(sort('falls', 'desc'))[0];

                    description = description.concat([
                        `${"**Legend with most:**"}`,
                        `〔Wins: ${toCodeBlock(`${TopWins.legend_name_key} - ${TopWins.wins}`)}〕`,
                        `〔Matchtime: ${toCodeBlock(`${TopMatchtime.legend_name_key} - ${((TopMatchtime.matchtime/60) / 60).toFixed(2)} hours`)}〕`,
                        `〔Damage Dealt: ${toCodeBlock(`${TopDamageDealt.legend_name_key} - ${TopDamageDealt.damagedealt}`)}〕`,
                        `〔Games played: ${toCodeBlock(`${TopGames.legend_name_key} - ${TopGames.games}`)}〕`,
                        `〔Level: ${toCodeBlock(`${TopLevel.legend_name_key} - ${TopLevel.level}`)}〕`,
                        `〔XP: ${toCodeBlock(`${TopXP.legend_name_key} - ${TopXP.xp}`)} 〕`,
                        `〔KOs: ${toCodeBlock(`${TopKOs.legend_name_key} - ${TopKOs.kos}`)}〕`,
                        `〔Falls: ${toCodeBlock(`${TopFalls.legend_name_key} - ${TopFalls.falls}`)}〕`
                    ])
                }

                let legendsjson = brawlhallalegends


                // const customcanvas = new CustomCanvas(800, 750)
                // customcanvas.rect(0, 0, 800, 750, '#01B0F1')
                // customcanvas.text(`${u ? u.username : author.username}'s Brawlhalla Stats`, 10, 40, '#FFFFFF', '40px sans-serif')
                
                const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
                
            

                let embed = new MessageEmbed()
                    .setColor(client.config.botEmbedHex)
                    .setAuthor({ name: `${u ? u.username : author.username}'s Brawlhalla Stats`, iconURL: `${u ? u.displayAvatarURL() : author.displayAvatarURL()}` })
                    .setDescription(description.join('\n'))
                    .setThumbnail(args[0] ? legendsjson.find((leg) => leg.legend_name_key == args[0].toLowerCase().trim())?.thumbnail || '' : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLB1letx0NtgkR-wgqOHCsYsISHHfsXepQzjMb3drZA&s`)
                    .setImage('attachment://banner.jpg')
                    .setTimestamp()
                    .setFooter({ text: `Requested by ${author.tag} | ${brawlhallaId}`, iconURL: author.displayAvatarURL() })

                    
                return channel.send({ embeds: [embed], files: [attachment] })
                // return channel.send({ embeds: [], files: [new MessageAttachment(customcanvas.gen().toBuffer('image/png'), `brawlhalla.png`)] })
            });
        })
    }
}


