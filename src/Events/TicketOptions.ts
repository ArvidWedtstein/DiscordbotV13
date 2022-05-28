import { Event, Command, SlashCommand} from '../Interfaces';
import Client from '../Client';
import { Interaction, Message, CommandInteraction, GuildMember, PermissionString, ExcludeEnum, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import language from '../Functions/language';
import { arg } from 'mathjs';
import TicketSchema from '../schemas/TicketSchema';
import settingsSchema from '../schemas/settingsSchema';


export const event: Event = {
    name: "interactionCreate",
    run: async (client: Client, interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return
        const { customId, guild, member, channel } = interaction

        if (!guild) return
        if (!member) return

        if (!["closeticket", "lockticket", "unlockticket"].includes(customId)) return

        if (!Object(await member.permissions).has("ADMINISTRATOR")) return temporaryMessage(channel, `${language(guild, 'PERMISSION_ERROR')}`, 10);
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

        const getEmoji = (emojiName: string) => client.emojis.cache.find((emoji) => emoji.name === emojiName);

        switch (customId) {
            case "closeticket":
                if (!channel) return;
                const ticket = await TicketSchema.findOneAndUpdate({
                    guildId: guild.id,
                    ChannelId: channel.id
                })

                // discord-html-transcripts?
                if (!ticket) return;
                await channel.delete()
                break;
            case "lockticket":
                if (!channel) return;
                const ticket2 = await TicketSchema.findOneAndUpdate({
                    guildId: guild.id,
                    ChannelId: channel.id
                })
                if (!ticket2) return;
                // await channel.updateOverwrite(guild.roles.everyone, {
                //     VIEW_CHANNEL: false,
                //     SEND_MESSAGES: false,
                //     ADD_REACTIONS: false,
                //     ATTACH_FILES: false,
                //     EMBED_LINKS: false,
                //     READ_MESSAGE_HISTORY: false
                // })
                break;
            case "unlockticket":
                if (!channel) return;
                const ticket3 = await TicketSchema.findOneAndUpdate({
                    guildId: guild.id,
                    ChannelId: channel.id
                })
                if (!ticket3) return;
                break;
        }
    }
}