import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import axios from 'axios';
export const command: Command = {
    name: "meme",
    description: "get a random meme",
    details: "Check the ping of this bot.",
    aliases: ["memez"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["meme"],
    
    run: async(client, message, args) => {
        const { author, channel } = message;
        const meme = await axios.get('https://meme-api.herokuapp.com/gimme')
        const { postLink, subreddit, title, url, nsfw, spoiler, author: memeauthor, ups, preview } = meme.data;
        const embed = new EmbedBuilder()
            .setAuthor({name: `Author: ${memeauthor} | Subreddit: ${subreddit}`, iconURL: preview[0]})
            .setTitle(`${title}`)
            .setImage(`${url}`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        channel.send({ embeds: [embed] });
    }
}