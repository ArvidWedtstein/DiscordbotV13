import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, EmbedFieldData, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { evaluate } from 'mathjs';


export const command: Command = {
    name: "math",
    description: "Write a math equation and watch it get solved",
    details: "Write a math equation and watch it get solved",
    aliases: ["mathematics", "meth"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["math"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;
        
        if (!guild) return;

        const filter = (m: any) => m.author.id === author.id;
        const collector = channel.createMessageCollector({ filter, time: 5 * (60*1000) })

        
        collector.on('collect', m => {
            if (m.content.includes(`=`)) collector.stop('solve')
        });
        
        collector.on('end', (collected, reason) => {
            if (reason != 'solve') return;
            let equationArgs: any = []
            collected.each(m => m.content.includes('=') ? equationArgs.push(m.content.trim().replace('=', '')) : equationArgs.push(m.content.trim()))
            equationArgs = equationArgs.join(' ')
            try {
                const embed = new EmbedBuilder()
                    .setColor(client.config.botEmbedHex)
                    .setDescription([
                        `Your Question 🤡: *${equationArgs}*`,
                        `Da Solution: **${Number(evaluate(equationArgs)).toPrecision()}**`
                    ].join('\n'))
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                    .setTimestamp()

                channel.send( {embeds: [embed] });
            } catch (err) {
                channel.send({ content: `Invalid Equation` })
            }
            
        });
        
        const embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setTitle(`Meth`)
            .setDescription(`You have 5 minutes to write the equation.`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()

        channel.send( {embeds: [embed] });
    }
}


