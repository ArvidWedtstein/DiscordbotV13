import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "guessthewordranked",
    description: "Get top 10 users that have solved most words",
    details: "Get top 10 users that have solved most words",
    aliases: ["gtwr", "gtwranked"],
    group: 'Random',
    hidden: false,
    UserPermissions: ["SendMessages", "AddReactions", "EmbedLinks"],
    ClientPermissions: ["SendMessages", "AddReactions", "EmbedLinks"],
    ownerOnly: false,
    examples: ["guessthewordranked"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;

        if (!guild) return;

        const guildId = guild.id;

        const sort = ((key: string, order = 'asc') => {
            return function innerSort(a: any, b: any) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    return 0;
                }

                const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
                const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

                let comparison = 0;
                if (varA > varB) {
                    comparison = 1;
                } else if (varA < varB) {
                    comparison = -1;
                }
                return (
                    (order === 'desc') ? (comparison * -1) : comparison
                );
            }
        })

        // Get all users that have played in this guild and sort them by their amount of solved words
        let result: any = await profileSchema.find({
            guildId: guildId,
            guessedWords: { $exists: true, $ne: null },
        })

        result = result.map((user: any) => {
            return {
                userId: user.userId,
                guessedWords: user.guessedWords.length,
            }
        }).sort(sort('guessedWords', 'desc'))


        let rankedList = result.map((user: any, index: any) => {
            const { userId, guessedWords } = user
            const userGuild = guild.members.cache.get(userId)
            
            return `#${index + 1} **${userGuild?.user.username}** with ${guessedWords} words solved!`
        })

        const attachment = new AttachmentBuilder('./img/banner.jpg');
        const embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setTitle(`Guess-The-Word Ranked Top 10`)
            .setDescription(rankedList.join('\n'))
            .setImage('attachment://banner.jpg')
            .setTimestamp()
            .setFooter({ text: `Requested By ${author.tag}`, iconURL: author.displayAvatarURL() })

        return message.reply({ embeds: [embed], files: [attachment] })
    }
}
