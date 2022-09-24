import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType } from 'discord.js';
export const command: Command = {
    name: "news",
    description: "write a newspost",
    aliases: ["nyhet"],
    run: async(client, message, args) => {
        console.log('news')
        // message.delete()
        const { guild } = message
        const guildId = guild?.id


        // const targetChannel = message.mentions.channels.first();
        const targetChannel = message.channel;
        if (!targetChannel) {

            message.reply(`${await language(guild, 'CHANNEL')}`)
            return
        }
        

        // Removes channel mention
        // args.shift();
        try {
            // Get JSON data
            const json = JSON.parse(args.join(' '))
            console.log(json)
            // const { text = ''} = json
            console.log(json)
            targetChannel.send({content: "News", embeds: [json]});
            
            if (targetChannel.type === ChannelType.GuildAnnouncement) message.crosspost()
        } catch(error:any) {
            message.reply(`${await language(guild, 'JSON_INVALID')} ${error.message}`)
        }
    }
}
