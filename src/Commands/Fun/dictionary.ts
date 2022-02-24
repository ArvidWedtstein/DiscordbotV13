import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import axios from 'axios';
export const command: Command = {
    name: "dictionary",
    description: "check my dictionary",
    details: "Check the dictionary of this bot.",
    aliases: ["ordbok"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["dictionary <word>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;

        if (!args[0]) return temporaryMessage(channel, `You need to provide a word`, 10);

        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${args[0]}`).then((res) => {
            res.data.forEach(async (word: any) => {
                const { meanings, word: dictword, origin } = word;
                const embed = new MessageEmbed()
                    .setTitle(`Dictionary | ${args[0]}`)
                    .setDescription(`Word: ${dictword} [${meanings[0].partOfSpeech}]\n
                    **Definition**: ${meanings[0].definitions[0].definition}
                    ${meanings[0].definitions[0].example ? `**Example**: ${meanings[0].definitions[0].example}` : ''}\n\n`)
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                    if (origin) {
                        embed.addField(`Origin:`, `${origin}`)
                    }
                channel.send({ embeds: [embed] });
            });
        }).catch((err) => {
            const errorembed = new MessageEmbed()
                .setTitle(err.response.data.title)
                .setDescription(`${err.response.data.message}\n\n${err.response.data.resolution}`)
            temporaryMessage(channel, errorembed, 10);
        })
    }
}
