import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { ButtonStyle, Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Interaction, AttachmentBuilder, ChannelType, PermissionsBitField, PermissionFlagsBits } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';


export const command: Command = {
    name: "ticket",
    description: "send a ticket",
    aliases: ["helpticket"],
    hidden: false,
    UserPermissions: ["SendMessages", "Administrator"],
    ClientPermissions: ["SendMessages", "AddReactions", "ViewChannel", "ReadMessageHistory"],
    ownerOnly: false,
    examples: ["ticket"],
    
    run: async(client, message, args) => {
        const { guild, author, member, channel: chan } = message;
        if (!guild) return
        const guildId = guild.id

        const setting = await Settings(message, 'ticket');
        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Ticket")}`);

        const getEmoji = (emojiName: string) => client.emojis.cache.find((emoji) => emoji.name === emojiName);

        const getChannel = (channelId: any) => guild.channels.cache.get(channelId);

        function genButton(id: string, label: string, emoji: any, style: ButtonStyle) {
            return new ButtonBuilder({
                customId: id,
                label: label,
                emoji: emoji,
                style: style
            })
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() || client.user?.displayAvatarURL() })
            .setDescription(`Open a ticket to discuss any of the issues listed on the bottom`)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                genButton("userticket", "User Report", getEmoji("really"), ButtonStyle.Primary),
                genButton("bugticket", "Bug Report", getEmoji("really"), ButtonStyle.Secondary),
                genButton("otherticket", "Other Report", getEmoji("really"), ButtonStyle.Success),
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

        if (!settings) return
        if (!settings.ticketSettings || !getChannel(settings.ticketSettings.CategoryId)) {
            await guild.channels.create({name: `Ticket System`, type: ChannelType.GuildCategory }).then(async (channel) => {
                sett.CategoryId = channel.id
            })
        }
        const category = await getChannel(sett?.CategoryId) as Discord.CategoryChannel
        if (!settings?.ticketSettings || !sett.CategoryId) {
            await guild.channels.create({ 
                name: `open-a-ticket`, 
                type: ChannelType.GuildText, 
                reason: "Ticket channel", 
                parent: category.id,
                topic: "Open a ticket",
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [
                            PermissionFlagsBits.SendMessages, 
                            PermissionFlagsBits.UseApplicationCommands, 
                            PermissionFlagsBits.Administrator,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.CreatePublicThreads,
                            PermissionFlagsBits.CreatePrivateThreads
                        ]
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