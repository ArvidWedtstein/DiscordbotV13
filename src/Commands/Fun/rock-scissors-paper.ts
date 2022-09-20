import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import math, { re } from 'mathjs';

export const command: Command = {
    name: "rock",
    description: "stone, scissors or paper!",
    details: "play a game of stone, scissors or paper!",
    aliases: ["paper", "scissors", "rps"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: true,
    examples: ["rps"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        const guildId = guild?.id

        const emojis = ['✊', '🤚', '✌️']
        
        let embed = new EmbedBuilder()
        .setColor("BLURPLE")
        .setTitle(`${language(guild, 'RPS_TITLE')}`)
       
        let EmbedBuilder = await channel.send({ embeds: [embed] });
        
        EmbedBuilder.react(emojis[0]);
        EmbedBuilder.react(emojis[1]);
        EmbedBuilder.react(emojis[2]);
        
        const getResult = (reaction: any, botChoice: any) => {
            if ((reaction === emojis[0] && botChoice === emojis[2]) ||
                (reaction === emojis[1] && botChoice === emojis[0]) ||
                (reaction === emojis[2] && botChoice === emojis[1])) {
                    return `${language(guild, 'RPS_WIN')}!`;
                } else if (reaction === botChoice) {
                    return `${language(guild, 'RPS_TIE')}!`
                } else {
                    return `${language(guild, 'RPS_LOOSE')}!`
                }
        }
        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id != message.channel.id) return;
            const botchoice = emojis[Math.floor(Math.random() * emojis.length)];

            const result = getResult(reaction.emoji.name, botchoice)
            
            let embed2 = new Discord.EmbedBuilder()
                .setColor("DARKER_GREY")
                .setTitle(`${language(guild, 'RPS_TITLE')}`)
                .addField(result, `${reaction.emoji} vs ${botchoice}`)
            let EmbedBuilder2 = EmbedBuilder.edit({ embeds: [embed2] });
            EmbedBuilder.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            return
        });
        
    }
}
