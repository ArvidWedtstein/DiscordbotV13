import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';

export const command: Command = {
    name: "poll",
    description: "Create a poll",
    details: "Create a poll. `poll 'question' | 'time in minutes' | 'choices (seperated by comma)'`",
    aliases: ["avstemmning"],
    group: "Guild",
    hidden: false,
    UserPermissions: ["SendMessages", "AddReactions"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'ATTACH_FILES',
        'EmbedLinks',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'ViewChannel'
    ],
    ownerOnly: false,
    examples: ["poll <question> | time | choice1,choice2.."],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, id } = message;
        
        if (!guild) return

        let pollId = id.slice(12);

        let delimiter = '|'
        let start = 1
        let tokens = args.join(' ').split(delimiter).slice(start+1)
        let choices = tokens.join(delimiter).split(','); 
             
        let time = args.join(' ').split(delimiter).slice(start)[0]

        // To get the substring BEFORE the nth occurence
        let tokens2 = args.join(' ').split(delimiter).slice(0, start);
        let question = tokens2.join(delimiter); 

        // Check if question, choices and a time is specified
        if (!question) return temporaryMessage(channel, `No question provided`, 10);
        if (!choices) return temporaryMessage(channel, `No choices provided. Use 'poll <question> | time | choice1,choice2..'`, 10);
        if (!time) return temporaryMessage(channel, `No time specified`, 10);

        let alphabet = [...Array(26)].map((q,w)=>String.fromCharCode(w+97))

        const letterToEmoji = (letter: string) => { return String.fromCodePoint(`${letter.toUpperCase()}`.charCodeAt(0) - 65 + 0x1f1e6)}

        const percentage = (partialValue: any, totalValue: number) => { return (100 * partialValue) / totalValue; } 
        const sum = (values: string[]) => { return values.reduce((a: any, b: any) => a + b, 0)}

        const description: any = [
            `**Question**`,
            `${question}`,
            `\u200b`,
            `**Choices**`,
        ]
        for (let i = 0; i < choices.length; i++) {
            description.push(`${letterToEmoji(alphabet[i])} ${choices[i]}`)
        }

        let embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setDescription(description.join('\n'))
            .setFooter({ text: `Poll ID: ${pollId}` })
        let embedmsg = await message.channel.send({ embeds: [embed] });

        let answers: any = {}
        for (let i = 0; i < choices.length; i++) {
            if (alphabet[i]) {
                embedmsg.react(letterToEmoji(alphabet[i]))
                answers[alphabet[i]] = 0
            }
        }

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            
            // Check If user already has reacted
            reaction.message.reactions.cache.map(x => {
                if (x.emoji.name != reaction.emoji.name && x.users.cache.has(user.id)) x.users.remove(user.id)
            })
            

            if (reaction.message.embeds[0].footer?.text != `Poll ID: ${pollId}`) return
            pollId = reaction.message.embeds[0].footer.text.replace('Poll ID ', '');
                
            let i = 0
            reaction.message.reactions.cache.forEach(react => {
                let name: any = react.emoji.name
                
                if (name && react.emoji.name) {
                    answers[Object.keys(answers)[i]] = react.count-1
                }
                i++
            })
        })
        client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.embeds[0].footer?.text == `Poll ID: ${pollId}`) {
                pollId = reaction.message.embeds[0].footer.text.replace('Poll ID ', '');
                let i = 0
                reaction.message.reactions.cache.forEach(react => {
                    let name: any = react.emoji.name
                    
                    if (name && react.emoji.name) {
                        answers[Object.keys(answers)[i]] = react.count-1
                    }
                    i++
                })
            }
        });
        setTimeout(async () => {

            description.push(`\u200b`)
            description.push(`**Final Result**`)

            await console.log(answers)
            

            for (const [key, value] of Object.entries(answers)) {
                description.push(`${letterToEmoji(key)} [${value} • ${percentage(value, sum(Object.values(answers)))}%]`)
            }
            let embedfinal = new EmbedBuilder()
                .setColor(client.config.botEmbedHex)
                .setDescription(description.join('\n'))
                .setFooter({ text: `Poll ID: ${pollId}` })
            embedmsg.edit({ embeds: [embedfinal] })
        }, parseInt(time.trim()) * (1000 * 60))
        
    }
}