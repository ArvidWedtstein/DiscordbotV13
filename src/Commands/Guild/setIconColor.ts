import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import colorss from '../../icons.json';

export const command: Command = {
    name: "seticoncolor",
    description: "set the icon color for the guild",
    details: "set the icon color for the guild",
    aliases: ["iconcolor"],
    group: "Guild",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "MANAGE_GUILD"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["seticoncolor"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return

        // TODO - Add this to settings menu
        let colors: any = colorss
        const btns = []
        for (let i = 0; i < colors.colors.length; i++) {
            let col = new MessageButton()
                .setEmoji(colors[colors.colors[i]].checkmark)
                .setLabel(colors.colors[i])
                .setStyle(3)
                .setCustomId(i.toString())
            btns.push(col)
        }

        const filter = (i: Interaction) => i.user.id === author.id && 
                i.isButton() && 
                i.customId === 'brawlhalla_code_menu';
            
        const close = new MessageButton()
            .setEmoji('❌')
            .setStyle(1)
            .setCustomId('close')
        let embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setTitle(`Color`)
            .setDescription(`Select Color`)

        let messageEmbed = await channel.send({
            embeds: [embed]
        }).then(async msg => {
            const collector = msg.createMessageComponentCollector({
                filter,
                max: 1,
                time: 1000 * 60
            })
    
            collector.on('collect', (reaction) => {
                switch (reaction.customId) {
                    case "0":
                        let embedBlue = new Discord.MessageEmbed()
                        .setTitle(`Color`)
                        .setDescription(`Color set to Blue`)
                        // let messageEmbedDE = await messageEmbed.edit({
                        //     embed: embedBlue,
                        //     buttons: [close]
                        // });
                        // setColor(guild, 'blue')
                        // await settingsSchema.findOneAndUpdate({
                        //     guildId: guild.id
                        // }, {
                        //     guildId: guild.id,
                        //     iconcolor: 'blue'
                        // }, {
                        //     upsert: true
                        // })
                        break;                    
                    case "1":
                        let embedRed = new Discord.MessageEmbed()
                        .setTitle(`Language`)
                        .setDescription(`Color set to Red`)

                        // let messageEmbedRed = await messageEmbed.edit({
                        //     embed: embedRed,
                        //     buttons: [close]
                        // });

                        // setColor(guild, 'red')

                        // await settingsSchema.findOneAndUpdate({
                        //     guildId: guild.id
                        // }, {
                        //     guildId: guild.id,
                        //     iconcolor: 'red'
                        // }, {
                        //     upsert: true
                        // })
                        break;
                    case "2":
                        let embedPurple = new Discord.MessageEmbed()
                        .setTitle(`Language`)
                        .setDescription(`Language set to Purple`)
                        
                        // <let messageEmbedPurple = await messageEmbed.edit({
                        //     embed: embedPurple,
                        //     buttons: [close]
                        // });

                        // setColor(guild, 'purple')

                        // await settingsSchema.findOneAndUpdate({
                        //     guildId: guild.id
                        // }, {
                        //     guildId: guild.id,
                        //     iconcolor: 'purple'
                        // }, {
                        //     upsert: true
                        // })
                        break;
                    case "3": 
                        let embedYellow = new Discord.MessageEmbed()
                        .setTitle(`Color`)
                        .setDescription(`Language set to Yellow`)
                        
                        // let messageEmbedYellow = await messageEmbed.edit({
                        //     embed: embedYellow,
                        //     buttons: [close]
                        // });

                        // setColor(guild, 'yellow')

                        // await settingsSchema.findOneAndUpdate({
                        //     guildId: guild.id
                        // }, {
                        //     guildId: guild.id,
                        //     iconcolor: 'yellow'
                        // }, {
                        //     upsert: true
                        // })
                        break;
                case "close": 
                        // messageEmbed.delete()
                        break;
                }
            })
    
            collector.on('end', (collected, reason) => {
                console.log(collected, reason)
            })  
        })


        // this.client.on('clickButton', async (btn) => {
            
        //     switch (btn.id) {
        //         case "0":
        //             let embedBlue = new Discord.MessageEmbed()
        //             .setTitle(`Color`)
        //             .setDescription(`Color set to Blue`)
        //             let messageEmbedDE = await messageEmbed.edit({
        //                 embed: embedBlue,
        //                 buttons: [close]
        //             });
        //             setColor(guild, 'blue')
        //             await settingsSchema.findOneAndUpdate({
        //                 guildId: guild.id
        //             }, {
        //                 guildId: guild.id,
        //                 iconcolor: 'blue'
        //             }, {
        //                 upsert: true
        //             })
        //             btn.reply.defer()
        //             break;                    
        //         case "1":
        //             let embedRed = new Discord.MessageEmbed()
        //             .setTitle(`Language`)
        //             .setDescription(`Color set to Red`)

        //             let messageEmbedRed = await messageEmbed.edit({
        //                 embed: embedRed,
        //                 buttons: [close]
        //             });

        //             setColor(guild, 'red')

        //             await settingsSchema.findOneAndUpdate({
        //                 guildId: guild.id
        //             }, {
        //                 guildId: guild.id,
        //                 iconcolor: 'red'
        //             }, {
        //                 upsert: true
        //             })
        //             btn.reply.defer()
        //             break;
        //         case "2":
        //             let embedPurple = new Discord.MessageEmbed()
        //             .setTitle(`Language`)
        //             .setDescription(`Language set to Purple`)
                    
        //             let messageEmbedPurple = await messageEmbed.edit({
        //                 embed: embedPurple,
        //                 buttons: [close]
        //             });

        //             setColor(guild, 'purple')

        //             await settingsSchema.findOneAndUpdate({
        //                 guildId: guild.id
        //             }, {
        //                 guildId: guild.id,
        //                 iconcolor: 'purple'
        //             }, {
        //                 upsert: true
        //             })
        //             btn.reply.defer()
        //             break;
        //         case "3": 
        //             let embedYellow = new Discord.MessageEmbed()
        //             .setTitle(`Color`)
        //             .setDescription(`Language set to Yellow`)
                    
        //             let messageEmbedYellow = await messageEmbed.edit({
        //                 embed: embedYellow,
        //                 buttons: [close]
        //             });

        //             setColor(guild, 'yellow')

        //             await settingsSchema.findOneAndUpdate({
        //                 guildId: guild.id
        //             }, {
        //                 guildId: guild.id,
        //                 iconcolor: 'yellow'
        //             }, {
        //                 upsert: true
        //             })
        //             btn.reply.defer()
        //             break;
        //     case "close": 
        //             messageEmbed.delete()
        //             btn.reply.defer()
        //             break;
        //     }
                
        // });
        
    }
}