import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed';
export const command: Command = {
    name: "testembed2",
    description: "testembed",
    details: "testembed",
    aliases: ["testingembed"],
    hidden: true,
    UserPermissions: ["Administrator"],
    ClientPermissions: ["SendMessages", "AddReactions", "EmbedLinks"],
    ownerOnly: true,
    examples: ["testembed"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        if (!guild) return
        const guildId = guild.id;
        const userId = author.id

        // let color = await getColor(guildId, userId)

        const pages: PageEmbedOptions[] = [
            {
                
                // selectMenu: {
                //     items: [{
                        
                //     }]
                // }
            }
        ]

        const t = new PageEmbed({
            selectMenu: {
                placeholder: "test",
                customId: 'page_embed_selectmenu',
                disabled: false,
                options: [
                    {
                        label: "test",
                        description: "test",
                        value: "test",
                    },
                    {
                        label: "2test2",
                        description: "2test2",
                        value: "2test2",
                    },
                ],
                maxValues: 1,
                minValues: 1
            },
            pages: [
                {
                    color: client.config.botEmbedHex,
                    title: `${language(guild, 'HELP_TITLE')}`,
                    description: `Test`,
                    selectMenuItemID: 'test',
                },
                {
                    color: client.config.botEmbedHex,
                    title: `${language(guild, 'HELP_TITLE')}2`,
                    description: `Test2`,
                    selectMenuItemID: '2test2',
                },
            ]
        })

        await t.post(message)
        
        // const btn = new MessageButton()
        //     .setCustomId('daily')
        //     .setLabel(`Click to claim your XP`)
        //     .setEmoji('💸')
        //     .setStyle('SUCCESS')
        // const row = new MessageActionRow()
        //     .addComponents(btn)
        // const attachment = new AttachmentBuilder('./img/banner.jpg');
        // const embed = new EmbedBuilder()
        //     .setColor(color)
        //     .setDescription(`jjj`)
        //     .setImage('attachment://banner.jpg')
        //     .setFooter({ text: `Requested By ${author.tag}`, iconURL: author.displayAvatarURL() })
        // message.reply({ embeds: [embed], components: [row], files: [attachment] }).then(async msg => {
        //     const filter = (i: Interaction) => i.user.id === author.id;
        //     let collect = msg.createMessageComponentCollector({
        //         filter, 
        //         max: 1,
        //         time: 60*1000
        //     });
        //     collect.on('collect', async (reaction) => {
        //         if (!reaction) return;
        //         reaction.deferUpdate();
        //         // reaction.message.embeds[0].description = `${author} ${await language(guild, "DAILY_ERLINGCOINS")}! (${xpreward}xp)`
        //         // msg.edit({ embeds: [embed.setDescription(`${author} ${await language(guild, "DAILY_ERLINGCOINS")}! (${xpreward}xp)`)] })
        //     })
        // })
    }
}
