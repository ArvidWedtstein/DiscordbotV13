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
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed';
import icon, { loadColors } from '../../Functions/icon';
import moment from 'moment';
import axios from 'axios';
export const command: Command = {
    name: "brawlhallalegends",
    description: "See description of all brawlhalla legends",
    details: "See description of all brawlhalla legends",
    aliases: ["bwllegends"],
    ownerOnly: false,
    ClientPermissions: ["SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "VIEW_CHANNEL"],
    UserPermissions: ["SEND_MESSAGES"],
    examples: [`-brawlhallalegends`],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;

        if (!guild) return;

        function getEmoji(name: string) {
            return client.emojis.cache.find(emoji => emoji.name === name)
        }

        function toCodeBlock(str: any) {
            return `\`${str}\``
        }

        function capitalizeFirstLetter(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        // Generates a statusbar for a stat
        function genStatbar(stat: number) {
            let baricon = "⬜";
            let empty = "⬛";
            return `${toCodeBlock(`${baricon.repeat(stat)}${empty.repeat(10 - stat)}`)}`
        }

        let legends = brawlhallalegends

        const pages: PageEmbedOptions[] = [
            {
                color: client.config.botEmbedHex,
                title: `All Legends`,
                description: [
                    `**Legend Name**\n`,
                ].join('\n'),
                timestamp: new Date(),
            }
        ]

        legends.map(legend => {
            pages.push({
                color: client.config.botEmbedHex,
                author: { name: `${legend.bio_name} Aka`, iconURL: `${legend.thumbnail}` },
                title: `${capitalizeFirstLetter(legend.bio_aka)}`,
                description: [
                    `> ${legend.bio_quote.replaceAll('\n', '\n > ')}`,
                    `\f*${legend.bio_quote_about_attrib}*\n`,
                    `> ${legend.bio_quote_from}\r`,
                    `*${legend.bio_quote_from_attrib}*\n`,
                    `${getEmoji('attack')}: ${genStatbar(legend.strength)}`,
                    `${getEmoji('dexterity')}: ${genStatbar(legend.dexterity)}`,
                    `${getEmoji('defense')}: ${genStatbar(legend.defense)}`,
                    `${getEmoji('speed')}: ${genStatbar(legend.speed)}`,
                    `Weapon 1: ${getEmoji(legend.weapon_one.toLowerCase())}`,
                    `Weapon 2: ${getEmoji(legend.weapon_two.toLowerCase())}\n`,
                    `Gender: ${toCodeBlock(capitalizeFirstLetter(legend.gender))}${legend.gender === 'male' ? `🚹` : `🚺`}\n`,
                    `Botname: ${toCodeBlock(legend.bot_name)}`,
                    `Price: ${legend.cost}${getEmoji('gold_coin')}`,
                    `Released on: ${toCodeBlock(legend.release_date)}`
                ].join('\n'),
                thumbnail: { url: `${legend.thumbnail}` },
                timestamp: new Date(),
            })
        })
        const t = new PageEmbed(pages);

        await t.post(message)
    }
}