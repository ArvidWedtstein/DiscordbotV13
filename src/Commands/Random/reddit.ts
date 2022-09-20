import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder } from 'discord.js';
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
        const embedreddit = new EmbedBuilder()
            .setTitle(`Meme`)
            // .setURL(`https://reddit.com/r/${subreddit}`)
            .setColor('#000000')
            // .setImage(img)
            // .setThumbnail(img)
        await message.reply({ embeds: [embedreddit] })
    }
}
