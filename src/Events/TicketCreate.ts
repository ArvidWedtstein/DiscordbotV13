import { Event, Command, SlashCommand} from '../Interfaces';
import Client from '../Client';
import { Interaction, Message, CommandInteraction, GuildMember, EmbedBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';

import language from '../Functions/language';
import { arg } from 'mathjs';
import TicketSchema from '../schemas/TicketSchema';
import settingsSchema from '../schemas/settingsSchema';


export const event: Event = {
    name: "interactionCreate",
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        const { customId, guild, member } = interaction

        if (!guild) return
        if (!member) return

        if (!["userticket", "bugticket", "otherticket"].includes(customId)) return

        const ID = Math.floor(Math.random() * 9000) + 10000;

        function genButton(id: string, label: string, emoji: any, style: ButtonStyle) {
            return new ButtonBuilder({
                customId: id,
                label: label,
                emoji: emoji,
                style: style
            })
        }

        let settings = await settingsSchema.findOne({
            guildId: guild.id
        })


        if (!settings || !settings.ticketSettings) return

        const getEmoji = (emojiName: string) => client.emojis.cache.find((emoji) => emoji.name === emojiName);

        await guild.channels.create({
            name: `${customId}-${ID}`, 
            type: ChannelType.GuildText,
            parent: settings.ticketSettings.CategoryId,
            permissionOverwrites: [
                {
                    id: member.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel, 
                        PermissionFlagsBits.SendMessages, 
                        PermissionFlagsBits.AddReactions, 
                        PermissionFlagsBits.AttachFiles, 
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                    deny: []
                },
                {
                    id: guild.roles.everyone.id,
                    deny: [
                        PermissionFlagsBits.ViewChannel, 
                        PermissionFlagsBits.SendMessages, 
                        PermissionFlagsBits.AddReactions, 
                        PermissionFlagsBits.AttachFiles, 
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                    allow: []
                }
            ]
        }).then(async (channel) => {
            const ticket = new TicketSchema({
                guildId: guild.id,
                userId: member.user.id,
                TicketId: ID,
                ChannelId: channel.id,
                Type: customId,
            }).save().catch((err: any) => console.log(err));

            const embed = new EmbedBuilder()
                .setColor(client.config.botEmbedHex)
                .setAuthor({ name: `${guild.name} | Ticket: ${ID}`, iconURL: guild.iconURL() || client.user?.displayAvatarURL() })
                .setDescription(`Please wait patiently for a staff member to respond to your ticket, in the meantime, please describe your ${language(guild, "TICKET_ISSUE")} below.`)
                .setFooter({ text: `The buttons below are Staff Only Buttons` })

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    genButton("closeticket", "Save & Close Ticket", "💾", ButtonStyle.Primary),
                    genButton("lockticket", "Lock Ticket", "🔒", ButtonStyle.Secondary),
                    genButton("unlockticket", "Unlock Ticket", "🔓", ButtonStyle.Success),
                )
            
            if (!channel.isTextBased()) return
            channel.send({
                embeds: [embed],
                components: [row]
            })
            await temporaryMessage(channel, `${member.user} here is your ticket`, 10)

            interaction.reply({ content: `${member.user} your ticket has been created: ${channel}`, ephemeral: true })
        })
    }
}