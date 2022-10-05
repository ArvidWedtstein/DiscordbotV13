import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, APIEmbedField } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import axios from 'axios';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "dictionary",
    description: "check my dictionary",
    details: "Check the dictionary of this bot.",
    aliases: ["ordbok"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["dictionary <word>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;


        if (!args[0]) return ErrorEmbed(message, client, command, `You need to provide a word`);

        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${args[0]}`).then((res) => {
            res.data.forEach(async (word: any) => {
                const { meanings, word: dictword, origin } = word;
                const embed = new EmbedBuilder()
                    .setTitle(`Dictionary | ${args[0]}`)
                    .setDescription(`Word: ${dictword} [${meanings[0].partOfSpeech}]\n
                    **Definition**: ${meanings[0].definitions[0].definition}
                    ${meanings[0].definitions[0].example ? `**Example**: ${meanings[0].definitions[0].example}` : ''}\n\n`)
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                    if (origin) embed.addFields({ name: `Origin:`, value: `${origin}` })
                    
                channel.send({ embeds: [embed] });
            });
        }).catch((err) => {
            return ErrorEmbed(message, client, command, [err.response.data.title, `${err.response.data.message}\n\n${err.response.data.resolution}`]);
        })
    }
}
