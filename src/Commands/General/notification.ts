import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, Interaction } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import moment from 'moment';
import { re } from 'mathjs';
export const command: Command = {
    name: "notification",
    description: "choose what you want to get notified about",
    details: "Choose what you want to get notified about.",
    aliases: ["notifications"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    run: async(client, message, args) => {
        const { guild, channel, author } = message

        if (!guild) return;

        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

        // TODO - Create either select menu with the notification settings or buttons. Toggle emoji of button/menuitem to show/hide.
        // or create a PageEmbed with a page to toggle each notification
        const results = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        })

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('brawlhalla_notification')
                    .setLabel(results.brawlhalla ? 'I do not wish brawlhalla notification plz' : 'I do wish brawlhalla notification plz')
                    .setStyle(results.brawlhalla ? "DANGER" : "SUCCESS")
                    .setEmoji('885437713707331634')
            )
        let embed = new MessageEmbed()
            .setTitle(`Notifications`)
            .setDescription(`This command is still in progress.`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        channel.send({ embeds: [embed], files: [attachment], components: [row] }).then(async msg => {
            await msg.react('🔔')

            const filter = (i: Interaction) => i.user.id === author.id;

            const collector = msg.createMessageComponentCollector({
                filter,
                time: 5 * (1000 * 60)
            })

            collector.on('collect', async(m) => {
                m.deferUpdate();

                if (m.customId.toLowerCase() === 'cancel') {
                    collector.stop('cancelled');
                }
                if (m.customId === 'brawlhalla_notification') {
                    row.components[0].setDisabled(true)
                    let embed = new MessageEmbed()
                        .setTitle(`Notifications`)
                        .setDescription(`Brawlhalla Notification was turned ${results.brawlhalla ? 'off' : 'on'}`)
                        .setImage('attachment://banner.jpg')
                        .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                        
                    msg.edit({ embeds: [embed], files: [attachment], components: [row] })
                    collector.stop('notification')
                }
            })
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    channel.send(`${author} - Timeout.`);
                } else if (reason === 'cancelled') {
                    channel.send(`${author} - Cancelled.`);
                } else if (reason === 'notification') {
                    const res = await profileSchema.findOneAndUpdate({
                        userId: author.id,
                        guildId: guild.id
                    }, {
                        brawlhalla: results.brawlhalla ? false : true
                    })
                    channel.send(`${author} - Notification was turned ${results.brawlhalla ? 'off' : 'on'}`);
                }
            })
        })
    }
}

