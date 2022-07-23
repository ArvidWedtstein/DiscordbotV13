import { Event, Command, SlashCommand} from '../Interfaces';
import Client from '../Client';
import { Interaction, Message, CommandInteraction, GuildMember, PermissionString, ExcludeEnum, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';
import { MessageButtonStyles } from 'discord.js/typings/enums';
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

        function genButton(id: string, label: string, emoji: any, style: ExcludeEnum<typeof MessageButtonStyles, "LINK">) {
            return new MessageButton({
                customId: id,
                label: label,
                emoji: emoji,
                style: style
            })
        }

        let settings = await settingsSchema.findOne({
            guildId: guild.id
        })

        if (!settings) return 
        if (!settings.ticketSystem) return
        
        const getEmoji = (emojiName: string) => client.emojis.cache.find((emoji) => emoji.name === emojiName);

        await guild.channels.create(`${customId}-${ID}`, {
            type: "GUILD_TEXT",
            parent: settings.ticketSettings.CategoryId,
            permissionOverwrites: [
                {
                    id: member.user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"],
                    deny: []
                },
                {
                    id: guild.roles.everyone.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"],
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

            const embed = new MessageEmbed()
                .setColor(client.config.botEmbedHex)
                .setAuthor({ name: `${guild.name} | Ticket: ${ID}`, iconURL: guild.iconURL() || client.user?.displayAvatarURL() })
                .setDescription(`Please wait patiently for a staff member to respond to your ticket, in the meantime, please describe your ${language(guild, "TICKET_ISSUE")} below.`)
                .setFooter({ text: `The buttons below are Staff Only Buttons` })

            const row = new MessageActionRow()
                .addComponents(
                    genButton("closeticket", "Save & Close Ticket", "💾", MessageButtonStyles.PRIMARY),
                    genButton("lockticket", "Lock Ticket", "🔒", MessageButtonStyles.SECONDARY),
                    genButton("unlockticket", "Unlock Ticket", "🔓", MessageButtonStyles.SUCCESS),
                )
            
            channel.send({
                embeds: [embed],
                components: [row]
            })
            await temporaryMessage(channel, `${member.user} here is your ticket`, 10)

            interaction.reply({ content: `${member.user} your ticket has been created: ${channel}`, ephemeral: true })
        })
    }
}