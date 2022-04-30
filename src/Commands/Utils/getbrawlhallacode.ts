import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, MessageAttachment, MessageSelectMenu } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "getbrawlhallacode",
    description: "Brawlhalla Code",
    details: "Brawlhalla Code",
    aliases: ["getbwlcode"],
    hidden: true,
    UserPermissions: ["ADMINISTRATOR"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS"],
    ownerOnly: true,
    examples: ["getbrawlhallacode"],
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        if (!guild) return

        

        const results = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        })

        let unfilteredcodes = results.brawlhallacodes

        let codes = unfilteredcodes.filter((unfilteredcodes: any) => unfilteredcodes.redeemed == false);


        // TODO - Mark code with redeemed after redeemed insted of removing it.


        if (args[0] && args[0].toLowerCase() === 'random') {
            args.shift()
            let rand = Math.floor(Math.random()*codes.length)
            let chosencode = codes[rand];

            codes[rand].redeemed = true;
            // codes.splice(codes.findIndex((code: any) => code.code === chosencode.code), 1)

            results.save()

            const embed = new MessageEmbed()
                .setTitle(`${author.tag}'s Brawlhalla Code`)
                .setDescription(`${chosencode.name} | \`${chosencode.code}\``)
                .setFooter({ text: `${guild.name} | ${guild.id}` })
                .setTimestamp()
            return author.send({ embeds: [embed] })
        }
        

        let options = []
        for (let i = 0; i < codes.length; i++) {
            let option: any = {
                label: `${codes[i].name}`,
                value: `${i}`,
                description: `${codes[i].name}`,
                emoji: {
                    name: `FeelsGerman`,
                    id: "885437713707331634"
                }
            }
            if (codes[i].name.length > 0) {
                options.push(option)
            }
        }
        let row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu({
                    customId: 'Menu',
                    placeholder: "Select Item",
                    options: options,
                    maxValues: 1,
                    minValues: 1
                })
            )
        const embed = new MessageEmbed()
            .setTitle(`${author.tag}'s Brawlhalla Codes`)
            .setFooter({ text: `Requested by ${author.tag}` })
            .setTimestamp()
        author.send({ embeds: [embed], components: [row] }).then(async(msg: any) => {
            const filter = (i: Interaction) => i.user.id === author.id;

            let collect = msg.createMessageComponentCollector({
                filter, 
                max: 1,
                time: 60*1000
            });

            collect.on('collect', async (reaction: any) => {
                if (!reaction) return;
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (reaction.message.id != msg.id) return

                if (!reaction.isSelectMenu()) return;


                
                const embed2 = new MessageEmbed()
                    .setTitle(`${author.tag}'s Brawlhalla Code`)
                    .setDescription(`${codes[reaction.values[0]].name} | \`${codes[reaction.values[0]].code}\``)
                    .setFooter({ text: `Requested by ${author.tag}` })
                    .setTimestamp()
                reaction.update({ embeds: [embed2], components: [] })

                codes[reaction.values[0]].redeemed = true;
    
                results.save()
            })
        })
    }
}
