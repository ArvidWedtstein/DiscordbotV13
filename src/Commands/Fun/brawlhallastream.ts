import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "brawlhallastream",
    description: "get brawlhalla stream notifications",
    aliases: ["brawlhallatwitch"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
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
    examples: ["brawlhallastream"],
    
    run: async(client, message, args) => {
        const { channel, author, guild, mentions } = message;

        if (!guild) return;

        const userId = author.id;
        const guildId = guild.id;
        const results = await profileSchema.findOne({
            userId,
            guildId
        })


        if (!results.brawlhalla) {
            await new profileSchema({
                guildId,
                userId
            }).save()
        }

        const btn = new ButtonBuilder() 
            .setCustomId('brawlhallabutton')
            .setEmoji('885437713707331634')
            .setLabel(results.brawlhalla ? 'I do wish brawlhalla notification plz' : 'I do not wish brawlhalla notification plz')
            .setStyle(results.brawlhalla ? 3 : 4)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);


        const embed = (data: any) => {
            const currentembed = new EmbedBuilder()
                .setAuthor({name: `${author.username}`, iconURL: author.displayAvatarURL()})
                .setTitle(data ? `is now registered to recieve brawlhalla notifications`: `is not registered to recieve brawlhalla notifications`)
                .setImage('attachment://banner.jpg')
                .setFooter({ text: `Requested by ${author.tag}`})
                .setTimestamp()
            return currentembed
        }
        const attachment = new AttachmentBuilder('./img/banner.jpg');
        channel.send({ 
            embeds: [embed(results.brawlhalla)], 
            files: [attachment],
            components: [row] 
        }).then(async msg => {
            const filter = (i: Interaction) => i.user.id === author.id;
            let collect = msg.createMessageComponentCollector({
                filter, 
                max: 1,
                time: 60*1000
            });

            // Check for button interaction
            collect.on('collect', async (reaction: any) => {
                if (!reaction) return;
                if (!reaction.isButton()) return;
                if (reaction.customId !== 'brawlhallabutton') return

                const res = await profileSchema.findOneAndUpdate({
                    userId,
                    guildId
                }, {
                    brawlhalla: results.brawlhalla ? false : true
                })
                reaction.update({ embeds: [embed(!results.brawlhalla)] })
                if (msg.deletable) msg.delete();
                return 
            })
        })
    }
}