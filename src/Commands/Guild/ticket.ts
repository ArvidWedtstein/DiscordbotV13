import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Message, Interaction, ExcludeEnum, MessageAttachment, MessageButtonStyleResolvable } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "ticket",
    description: "send a ticket",
    aliases: ["helpticket"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
    ownerOnly: false,
    examples: ["ticket"],
    
    run: async(client, message, args) => {
        const { guild, author, member, channel: chan } = message;
        if (!guild) return
        const guildId = guild.id

        const setting = await Settings(message, 'ticket');
        if (!setting) return temporaryMessage(chan, `${insert(guild, 'SETTING_OFF', "Ticket")}`)

        const getEmoji = (emojiName: string) => client.emojis.cache.find((emoji) => emoji.name === emojiName);

        const getChannel = (channelId: string) => guild.channels.cache.get(channelId);

        function genButton(id: string, label: string, emoji: any, style: ExcludeEnum<typeof MessageButtonStyles, "LINK">) {
            return new MessageButton({
                customId: id,
                label: label,
                emoji: emoji,
                style: style
            })
        }

        const embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() || client.user?.displayAvatarURL() })
            .setDescription(`Open a ticket to discuss any of the issues listed on the bottom`)

        const row = new MessageActionRow()
            .addComponents(
                genButton("userticket", "User Report", getEmoji("really"), MessageButtonStyles.PRIMARY),
                genButton("bugticket", "Bug Report", getEmoji("really"), MessageButtonStyles.SECONDARY),
                genButton("otherticket", "Other Report", getEmoji("really"), MessageButtonStyles.SUCCESS),
            )

        let settings = await settingsSchema.findOne({
            guildId: guildId,
            ticketSettings: { $exists: true, $ne: null }
        })

        if (!settings) {
            settings = new settingsSchema({
                guildId: guildId
            }).save().catch((err: any) => console.log(err))
        }

        let sett = {
            CategoryId: "",
            ChannelId: "",
        }


        if (!settings.ticketSettings || !getChannel(settings.ticketSettings.CategoryId)) {
            await guild.channels.create(`Ticket System`, { type: "GUILD_CATEGORY", reason: "Ticket System" }).then(async (channel) => {
                sett.CategoryId = channel.id
            })
        }
        const category = await getChannel(sett?.CategoryId) as Discord.CategoryChannel
        if (!settings?.ticketSettings || !sett.CategoryId) {
            await guild.channels.create(`open-a-ticket`, { 
                type: "GUILD_TEXT", 
                reason: "Ticket channel", 
                parent: category.id,
                topic: "Open a ticket",
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ["SEND_MESSAGES", "USE_APPLICATION_COMMANDS", "ADMINISTRATOR", "EMBED_LINKS", "ATTACH_FILES", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"]
                    }
                ]
            }).then(async (channel) => {
                sett.ChannelId = channel.id
            })
        }

        settings = await settingsSchema.findOneAndUpdate({
            guildId: guildId,
        }, {
            $set: {
                ticketSettings: sett
            }
        })

        const channel = await getChannel(sett.ChannelId) as Discord.TextChannel

        if (channel) channel.send({ embeds: [embed], components: [row] })
    }
}