import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, EmojiIdentifierResolvable } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "howgay",
    run: async(client, message, args) => {
        console.log(args)
        // message.delete()
        const guildId = message.guild?.id
        const emoji: any = client.emojis.cache.get('801707111657504799')
        const getRandomIntInclusive = (async (min: number, max: number) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            const res: any = Math.floor(Math.random() * (max - min + 1)) + min;
            return res; //The maximum is inclusive and the minimum is inclusive 
        })
        if (message.mentions.users.first()) {
            const member = message.mentions.users.first()?.username || args[0];
            if (!member) return console.log('could not find member')
            
            const gay = await getRandomIntInclusive(0, 100);

            
            
            let embed = new Discord.MessageEmbed()
                    .setColor('#ff00ff')
                    .setTitle('Gayness Meter')
                    .setDescription(`According to my results, ${member}.\nis ${gay}% gay`)
            let messageEmbed = await message.channel.send({embeds: [embed]}).then(embedMessage => {
                if (gay > 60) {
                    embedMessage.react(emoji)
                }
            });
            
        } else {
            if (!args[0]) {
                return message.reply(`You need to define a thing or user: ${client.config.prefix}howgay <thing/user>`)
            }
            const gay = await getRandomIntInclusive(0, 100)
            //console.log(gay)
            
            let embed = new Discord.MessageEmbed()
                    .setColor('#ff00ff')
                    .setTitle('Gayness Meter')
                    .setDescription(`According to my results, ${args[0]}.\nis ${gay}% gay`)
            let messageEmbed = await message.channel.send({embeds: [embed]}).then(embedMessage => {
                if (gay > 60) {
                    embedMessage.react(emoji)
                    
                }
            });
        }
    }
}
