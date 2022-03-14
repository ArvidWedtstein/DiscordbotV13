import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import pollSchema from '../../schemas/pollSchema';

export const command: Command = {
    name: "poll",
    description: "Create a poll",
    details: "Create a poll. `poll 'question' | 'time in minutes' | 'choices (seperated by comma)'`",
    aliases: ["avstemmning"],
    group: "Guild",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL'
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
        var tokens2 = args.join(' ').split(delimiter).slice(0, start);
        var question = tokens2.join(delimiter); 

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

        let embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setDescription(description.join('\n'))
            .setFooter({ text: `Poll ID: ${pollId}` })
        let messageEmbed = await message.channel.send({ embeds: [embed] });

        let answers: any = {}
        for (let i = 0; i < choices.length; i++) {
            if (alphabet[i]) {
                messageEmbed.react(letterToEmoji(alphabet[i]))
                answers[alphabet[i]] = 0
            }
        }

        await new pollSchema({
            pollId: pollId.toString(),
            messageId: message.id,
            guildId: guild.id,
            question: question,
            answers: answers,
            current: true
        }).save();

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            
            // Check If user already has reacted
            reaction.message.reactions.cache.map(x => {
                if (x.emoji.name != reaction.emoji.name && x.users.cache.has(user.id)) x.users.remove(user.id)
            })
            
            // Check if guild still exist
            if (!reaction.message.guild.available) {
                await pollSchema.deleteMany({
                    guildId: guild.id
                })
            }

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
            const update = await pollSchema.findOneAndUpdate({
                pollId: pollId.toString(),
                guildId: guild.id
            }, {
                answers: answers
            })
            console.log(update)
        })
        client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            // Check if guild still exist
            if (!reaction.message.guild.available) {
                await pollSchema.deleteMany({
                    guildId: guild.id
                })
            }
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
                const update = await pollSchema.findOneAndUpdate({
                    pollId: pollId.toString(),
                    guildId: guild.id
                }, {
                    answers: answers
                })
                console.log(update)
            }
        });
        setTimeout(async () => {

            description.push(`\u200b`)
            description.push(`**Final Result**`)

            const res = await pollSchema.findOne({
                pollId: pollId.toString(),
                guildId: guild.id
            })
            console.log(res)
            await console.log(answers)
            

            for (const [key, value] of Object.entries(answers)) {
                description.push(`${letterToEmoji(key)} [${value} • ${percentage(value, sum(Object.values(answers)))}%]`)
            }
            let embedfinal = new MessageEmbed()
                .setColor(client.config.botEmbedHex)
                .setDescription(description.join('\n'))
                .setFooter({ text: `Poll ID: ${pollId}` })
            messageEmbed.edit({ embeds: [embedfinal] })
        }, parseInt(time.trim()) * (1000 * 60))
        
    }
}