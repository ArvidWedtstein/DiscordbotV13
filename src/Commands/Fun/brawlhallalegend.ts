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
    name: "brawlhallalegend",
    description: "See description of a brawlhalla legend",
    details: "See description of a brawlhalla legend",
    aliases: ["bwllegend"],
    ownerOnly: false,
    ClientPermissions: ["SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "VIEW_CHANNEL"],
    UserPermissions: ["SEND_MESSAGES"],
    examples: [`-brawlhallalegend {legend name}`],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;

        if (!guild) return;

        let legend = args.join(' ').toLowerCase();

        if (!legend) return temporaryMessage(channel, 'Please provide a legend name', 10);

        const getEmoji = async (emojiName: any) => {
            return await icon(client, guild, emojiName)
        }

        function toCodeBlock(str: any) {
            return `\`${str}\``
        }

        function capitalizeFirstLetter(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let legends = brawlhallalegends
        const chosenlegend = legends.find((leg) => leg.legend_name_key == legend);

        if (!chosenlegend) return temporaryMessage(channel, 'That legend does not exist 😐', 10);

        let baricon = "█";
        let empty = "▒";

        // Old progressbar icons
        // let baricon = "🟦"
        // let empty = "⬛"

        // let desc = [
        //     `**${chosenlegend.bio_quote}**`,
        //     `*${chosenlegend.bio_quote_about_attrib}*\n`,
        //     `**${chosenlegend.bio_quote_from}**`,
        //     `*${chosenlegend.bio_quote_from_attrib}*\n`,
        //     `-------------`,
        //     `Strength: ${toCodeBlock(baricon.repeat(chosenlegend.strength))}${empty.repeat(10 - chosenlegend.strength)}`,
        //     `Dexterity: ${toCodeBlock(baricon.repeat(chosenlegend.dexterity))}${empty.repeat(10 - chosenlegend.dexterity)}`,
        //     `Defense: ${toCodeBlock(baricon.repeat(chosenlegend.defense))}${empty.repeat(10 - chosenlegend.defense)}`,
        //     `Speed: ${toCodeBlock(baricon.repeat(chosenlegend.speed))}${empty.repeat(10 - chosenlegend.speed)}`,
        //     `-------------`,
        //     `Weapon 1: ${client.emojis.cache.find(emoji => emoji.name === chosenlegend.weapon_one.toLowerCase())}`,
        //     `Weapon 2: ${client.emojis.cache.find(emoji => emoji.name === chosenlegend.weapon_two.toLowerCase())}`,
        //     `-------------`,
        //     `Gender: ${toCodeBlock(capitalizeFirstLetter(chosenlegend.gender))}\n`,
        //     `Botname: ${toCodeBlock(chosenlegend.bot_name)}`,
        //     `Price: ${toCodeBlock(chosenlegend.cost)}`
        // ]
        
        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

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
                    `Strength: ${toCodeBlock(baricon.repeat(chosenlegend.strength))}${empty.repeat(10 - chosenlegend.strength)}`,
                    `Dexterity: ${toCodeBlock(baricon.repeat(chosenlegend.dexterity))}${empty.repeat(10 - chosenlegend.dexterity)}`,
                    `Defense: ${toCodeBlock(baricon.repeat(chosenlegend.defense))}${empty.repeat(10 - chosenlegend.defense)}`,
                    `Speed: ${toCodeBlock(baricon.repeat(chosenlegend.speed))}${empty.repeat(10 - chosenlegend.speed)}`,
                    `-------------`,
                    `Weapon 1: ${client.emojis.cache.find(emoji => emoji.name === chosenlegend.weapon_one.toLowerCase())}`,
                    `Weapon 2: ${client.emojis.cache.find(emoji => emoji.name === chosenlegend.weapon_two.toLowerCase())}`,
                    `-------------`,
                    `Gender: ${toCodeBlock(capitalizeFirstLetter(chosenlegend.gender))}${chosenlegend.gender === 'male' ? `🚹` : `🚺`}\n`,
                    `Botname: ${toCodeBlock(chosenlegend.bot_name)}${client.emojis.cache.find(emoji => emoji.name === 'gold_coin')}`
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
        const t = new PageEmbed(pages);

        await t.post(message)

        // const embed = new MessageEmbed()
        //     .setColor(client.config.botEmbedHex)
        //     .setTitle(`${capitalizeFirstLetter(chosenlegend.legend_name_key)} Aka ${capitalizeFirstLetter(chosenlegend.bio_aka)}`)
        //     .setDescription(desc.join('\n'))
        //     .setThumbnail(`${chosenlegend.thumbnail}`)
        //     .setImage(`attachment://banner.jpg`)
        //     .setTimestamp()
        //     .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL() });
            

        // channel.send({ embeds: [embed], files: [attachment] })


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