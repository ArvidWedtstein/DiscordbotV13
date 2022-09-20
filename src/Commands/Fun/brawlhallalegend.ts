import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import { addXP, getXP, getLevel } from '../../Functions/Level';
import brawlhallalegends from '../../brawlhallalegends.json';
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed';
import icon, { loadColors } from '../../Functions/icon';
import moment from 'moment';
import axios from 'axios';
export const command: Command = {
    name: "brawlhallalegend",
    description: "See description of a brawlhalla legend",
    details: "See description of a brawlhalla legend",
    aliases: ["bwllegend"],
    ownerOnly: false,
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL'
    ],
    UserPermissions: ["SEND_MESSAGES"],
    examples: [`-brawlhallalegend {legend name}`],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;

        if (!guild) return;

        let legend = args.join(' ').toLowerCase();

        if (!legend) return temporaryMessage(channel, 'Please provide a legend name', 10);

        function toCodeBlock(str: any) {
            return `\`${str}\``
        }

        // Old progressbar icons
        // let baricon = "🟦"
        // let empty = "⬛"
        function capitalizeFirstLetter(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function getEmoji(name: string) {
            return client.emojis.cache.find(emoji => emoji.name === name)
        }
        function genStatbar(stat: number) {
            let baricon = "█";
            let empty = "▒";
            return `${toCodeBlock(`${baricon.repeat(stat)}${empty.repeat(10 - stat)}`)}`
        }

        let legends = brawlhallalegends
        const chosenlegend = legends.find((leg) => leg.legend_name_key == legend);

        if (!chosenlegend) return temporaryMessage(channel, 'That legend does not exist 😐', 10);


        const pages: PageEmbedOptions[] = [
            {
                color: client.config.botEmbedHex,
                title: `${capitalizeFirstLetter(chosenlegend.legend_name_key)} Aka ${capitalizeFirstLetter(chosenlegend.bio_aka)}`,
                description: [
                    `**${chosenlegend.bio_quote}**`,
                    `*${chosenlegend.bio_quote_about_attrib}*\n`,
                    `**${chosenlegend.bio_quote_from}**`,
                    `*${chosenlegend.bio_quote_from_attrib}*\n`,
                    `-------------`,
                    `${getEmoji('attack')}: ${genStatbar(chosenlegend.strength)}`,
                    `${getEmoji('dexterity')}: ${genStatbar(chosenlegend.dexterity)}`,
                    `${getEmoji('defense')}: ${genStatbar(chosenlegend.defense)}`,
                    `${getEmoji('speed')}: ${genStatbar(chosenlegend.speed)}`,
                    `-------------`,
                    `Weapon 1: ${getEmoji(chosenlegend.weapon_one.toLowerCase())}`,
                    `Weapon 2: ${getEmoji(chosenlegend.weapon_two.toLowerCase())}`,
                    `-------------`,
                    `Gender: ${toCodeBlock(capitalizeFirstLetter(chosenlegend.gender))}${chosenlegend.gender === 'male' ? `🚹` : `🚺`}\n`,
                    `Botname: ${toCodeBlock(chosenlegend.bot_name)}`,
                    `Price: ${chosenlegend.cost}${getEmoji('gold_coin')}`,
                    `Released on: ${toCodeBlock(chosenlegend.release_date)}`
                ].join('\n'),
                thumbnail: { url: `${chosenlegend.thumbnail}` },
                timestamp: new Date(),
            },
            {
                color: client.config.botEmbedHex,
                title: `${capitalizeFirstLetter(chosenlegend.legend_name_key)}'s biography`,
                description: `${chosenlegend.bio_text}`,
                thumbnail: { url: `${chosenlegend.thumbnail}` },
                timestamp: new Date(),
            }
        ]
        const t = new PageEmbed({ pages: pages });

        await t.post(message)



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