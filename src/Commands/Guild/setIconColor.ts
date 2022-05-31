import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, ButtonInteraction, CacheType, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon, { setColor } from '../../Functions/icon';
import colorss from '../../icons.json';
import settingsSchema from '../../schemas/settingsSchema';
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

        const row = new MessageActionRow()
        for (let i = 0; i < colors.colors.length; i++) {
            let col = new MessageButton()
                .setEmoji(colors[colors.colors[i]].checkmark)
                .setLabel(colors.colors[i])
                .setStyle(3)
                .setCustomId(`iconcolor_${colors.colors[i]}`)
            row.addComponents(col)
        }

        const filter = (i: any) => i.user.id === author.id && i.isButton();
        
        const close = new MessageButton()
            .setEmoji('❌')
            .setStyle(1)
            .setCustomId('close')
        row.addComponents(close)

        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg')
        let embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setTitle(`Icon Color`)
            .setDescription(`Please select the color you want the guild's icons to look like`)
            .setImage('attachment://banner.jpg')

        let messageEmbed = await channel.send({
            embeds: [embed],
            components: [row],
            files: [attachment]
        }).then(async msg => {
            const collector = msg.createMessageComponentCollector({
                filter,
                max: 1,
                time: 1000 * 60 * 5,
                componentType: 'BUTTON'
            })
    
            collector.on('collect', (reaction) => {
                reaction.deferUpdate();
                switch (reaction.customId) {
                    case "iconcolor_blue":
                        embed.setDescription(`Color set to Blue`)
                        setColor(guild, 'blue');
                        break;                    
                    case "iconcolor_red":
                        embed.setDescription(`Color set to Red`)
                        setColor(guild, 'red')
                        break;
                    case "iconcolor_purple":
                        embed.setDescription(`Color set to Purple`)
                        setColor(guild, 'purple')
                        break;
                    case "iconcolor_yellow": 
                        embed.setDescription(`Color set to Yellow`)
                        setColor(guild, 'yellow')
                        break;
                    case "close": 
                        collector.stop('close');
                        break;
                }

                row.components.every(async (component) => {
                    component.setDisabled(true);
                })

                msg.edit({
                    embeds: [embed],
                    components: []
                })
                return
            })
        })
    }
}