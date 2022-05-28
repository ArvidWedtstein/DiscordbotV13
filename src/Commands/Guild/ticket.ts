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
    name: "ticket2",
    description: "send a ticket",
    aliases: ["helpticket2"],
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
        })

        if (!settings) {
            settings = new settingsSchema({
                guildId: guildId
            }).save().catch((err: any) => console.log(err))
        }

        let sett = {
            CategoryId: "",
            ChannelId: "",
            TranscriptsChannelId: ""
        }


        if (!settings.ticketSettings || !getChannel(settings.ticketSettings.CategoryId)) {
            await guild.channels.create(`Ticket System`, { type: "GUILD_CATEGORY", reason: "Ticket System" }).then(async (channel) => {
                sett.CategoryId = channel.id
            })
        }
        const category = await getChannel(sett.CategoryId) as Discord.CategoryChannel
        if (!settings.ticketSettings || !getChannel(settings.ticketSettings.ChannelId)) {
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
        if (!settings.ticketSettings || !getChannel(settings.ticketSettings.TranscriptsChannelId)) {
            await guild.channels.create(`transcripts`, { type: "GUILD_TEXT", reason: "Transcripts Channel", parent: category.id }).then((channel) => {
                sett.TranscriptsChannelId = channel.id
                // if (channel.parent != category) channel.setParent(category)
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
        const transcriptsChannel = getChannel(sett.TranscriptsChannelId) as Discord.TextChannel

        if (channel) channel.send({ embeds: [embed], components: [row] })
        // let channel: any = guild.channels.cache.find(channel => channel.name === 'tickets');
        // if (!channel) {
        //     channel = guild.channels.create('tickets', {
        //         nsfw: true,
        //         topic: "pain"
        //     })
        // }
        // const check = '<:yes:807175712515162183>'
        // let helpText = args.slice(0).join(' ');
        // let d = new Date();

        // //If there is no help
        // if (!helpText) {
        //     return temporaryMessage(chan, `${language(guild, 'TICKET_NOARGS')}`, 10)
        // }

        // if (helpText.length > 1024) {
        //     helpText = helpText.slice(0, 1021) + '...';
        // }
        // if (channel?.type != "GUILD_TEXT") return;

        // let embed = new MessageEmbed()
        //     .setColor('#ff0000')
        //     .setTitle(`${await language(guild, 'TICKET_ISSUE')}:`)
        //     .setDescription(helpText)
        //     .setAuthor({ name: `${author.username}`, iconURL: author.displayAvatarURL()} )
        //     .setFooter({ text: `${await language(guild, 'TICKET_UNSOLVED')} ${d.toLocaleTimeString()}`})
        // let messageEmbed = await channel.send({ embeds: [embed] }).then((msg: any) => {
        //     msg.react(check);

        //     client.on('messageReactionAdd', async (reaction, user) => {
        //         if (reaction.message.partial) await reaction.message.fetch();
        //         if (reaction.partial) await reaction.fetch();
        //         if (user.bot) return;
        //         if (!reaction.message.guild) return;
        //         const ReactUser = reaction.message.guild.members.cache.get(user?.id)
        //         let embed2 = new MessageEmbed()
        //             .setColor('#10ff00')
        //             .setTitle(`${await language(guild, 'TICKET_SOLVED')} ${await language(guild, 'TICKET_ISSUE')}:`)
        //             .setDescription(helpText)
        //             .setAuthor({name: `${member?.user?.username}`, iconURL: member?.user.displayAvatarURL()})
        //             .setTimestamp()
        //             .setFooter({ text: `${await language(guild, 'TICKET_SOLVEDBY')} ${user.username}`})
        //         reaction.message.edit({ embeds: [embed2] });
        //         member?.user.send(`${await language(guild, 'TICKET_SOLVEDISSUE')} ${user.username}`)
                
        //     });
        //     client.on('messageReactionRemove', async (reaction, user) => {
        //         if (reaction.message.partial) await reaction.message.fetch();
        //         if (reaction.partial) await reaction.fetch();
        //         if (user.bot) return;
        //         if (!reaction.message.guild) return;
    
        //         const ReactUser = reaction.message.guild.members.cache.get(user?.id)
        //         let embed = new MessageEmbed()
        //             .setColor('#ff0000')
        //             .setTitle(`${language(guild, 'TICKET_ISSUE')}:`)
        //             .setDescription(helpText)
        //             .setAuthor({ name: `${member?.user.username}`, iconURL: member?.user.displayAvatarURL() })
        //             .setFooter({ text: `${language(guild, 'TICKET_UNSOLVED')} ${d.toLocaleTimeString()}`})
        //         message.edit({ embeds: [embed] });
        //         member?.user.send(`${language(guild, 'TICKET_UNSOLVEDISSUE')}`)
        //     });
        // })
    }
}