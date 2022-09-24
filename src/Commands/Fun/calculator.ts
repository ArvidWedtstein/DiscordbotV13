import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder, Interaction, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import math, { re } from 'mathjs';
import { Embed } from '@discordjs/builders';

export const command: Command = {
    name: "calculator",
    description: "calculator",
    details: "calculator",
    aliases: ["kalkulator"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel'
    ],
    ownerOnly: true,
    examples: ["calculator"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        const guildId = guild?.id

        let button: any = new Array([], [], [], [], [])
        let row: ActionRowBuilder<ButtonBuilder>[] = []
        let text = ["clear", "(", ")", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", ".", "0", "00", "="]
        let current = 0;

        const addRow = (btns: any) => {
            let row1 = new ActionRowBuilder<ButtonBuilder>()
            for (let btn of btns) {
                row1.addComponents(btn)
            }
            return row1
        }
        const createButton = (label: any, style: any = "DANGER") => {
            if (label === "clear") style = "SUCCESS"
            else if (label === ".") style = "SUCCESS"
            else if (label === "=") style = "SUCCESS"
            else if (isNaN(label)) style = "DANGER"

            const btn = new ButtonBuilder()
                .setLabel(label)
                .setStyle(style)
                .setCustomId("cal" + label)
            return btn
        }

        const mathEval = (input: any) => {
            try {
                let res = math.evaluate(input)
                return res
            } catch {
                return "Wrong input"
            }
        }
        for (let i = 0; i < text.length; i++) {
            if (button[current].length === 4) current++
            button[current].push(createButton(text[i]))
            if (i === text.length - 1) {
                for (let btn of button) row.push(addRow(btn));
            }
        }
        
        const embed = new EmbedBuilder()
            .setColor("#0000ff")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription("```0```")

        
        message.channel.send({
            embeds: [embed],
            components: row
        }).then((msg) => {
            let isWrong = false;
            let time = 60000;
            let value = ""
            let embed1 = new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setColor("#0000FF")

            const createCollector = (val: any, result: any = false) => {
                const filter = (i: Interaction) => i.user.id === message.author.id;
                let collect = msg.createMessageComponentCollector({
                    filter, 
                    max: 10000,
                    time: time
                });
                collect.on('collect', async (reaction) => {
                    if (!reaction) return;

                    // reaction.deferUpdate();
                    if (result === "new") value = "0"
                    else if (isWrong) {
                        value = val
                        isWrong = false;
                    } 
                    else if (result === "0") value = val;
                    else if (result) {
                        isWrong = true;
                        value = mathEval(value)
                    }
                    else value += val

                    embed1.setDescription("```" + value + "```")

                    msg.edit({
                        embeds: [embed1],
                        components: row
                    })
                    
                })
            }
            for (let txt of text) {
                let result;
                if (txt === "clear") result = "new";
                else if (txt === "=") result = true;
                else result = false
                createCollector(txt, result)
            }

            setTimeout(() => {
                embed1.setDescription("Your calculator time is running out")
                embed1.setColor("#ff0000")
                msg.edit({
                    embeds: [embed1]
                })
            }, time)
        })
        
    }
}