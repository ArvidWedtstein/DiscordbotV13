import { Command } from '../../Interfaces';
import { Settings } from '../../settings';
import * as gradient from 'gradient-string';
import language from '../../language';
import { addCoins, setCoins, getCoins, getColor } from '../../economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import api from 'imageapi.js';
export const command: Command = {
    name: "reddit",
    hidden: true,
    disabled: true,
    run: async(client, message, args) => {
        // message.delete()
        const { guild, channel } = message
        const guildId = guild?.id
        let subreddits = [
            "comedyheaven",
            "dank",
            "nsfw",
            "meme",
            "memes"
        ]
        let subreddit = subreddits[Math.floor(Math.random()*(subreddits.length))]
        console.log(subreddit)
        let img = await api(subreddit)
        const embedreddit = new MessageEmbed()
            .setTitle(`Meme`)
            // .setURL(`https://reddit.com/r/${subreddit}`)
            .setColor('#000000')
            // .setImage(img)
            // .setThumbnail(img)
        await message.reply({ embeds: [embedreddit] })
    }
}
