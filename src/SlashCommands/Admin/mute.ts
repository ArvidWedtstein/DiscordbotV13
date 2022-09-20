import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuCommandInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ApplicationCommandType, ButtonStyle } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "mute",
    type: ApplicationCommandType.User,
    permissions: ['KICK_MEMBERS', 'MUTE_MEMBERS'],
    ClientPermissions: ['MUTE_MEMBERS', 'KICK_MEMBERS'],
    testOnly: true,
    run: async (client, interaction) => {
        // if (!interaction.isCommand()) return
        if (!interaction.isUserContextMenuCommand()) return
        // if (interaction.isContextMenu()) return
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.member?.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setDescription(`choose timeout length for`)
            .setFooter({ text: `${interaction.targetUser.tag}`, iconURL: interaction.targetUser.displayAvatarURL() })
            
        const row = new ActionRowBuilder<ButtonBuilder>() 
            .addComponents(
                new ButtonBuilder()
                    .setLabel('60 sec')
                    .setCustomId('mute1')
                    .setStyle(4)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel('5 min')
                    .setCustomId('mute2')
                    .setStyle(4)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel('10 min')
                    .setCustomId('mute3')
                    .setStyle(4)
            )
        const row2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('1 hour')
                    .setCustomId('mute4')
                    .setStyle(4)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel('1 day')
                    .setCustomId('mute5')
                    .setStyle(4)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel('1 week')
                    .setCustomId('mute6')
                    .setStyle(4)
            )

        await interaction.followUp({ embeds: [embed], components: [row, row2] })

        client.on("interactionCreate", async (button) => {
            if (!button.isButton()) return;
            
            console.log(`ID: `, button.customId)
            if (button.member?.user.id != interaction.member?.user.id) return;
            let member = interaction.guild?.members.cache.find(mem => mem.id === interaction.targetId)
            switch (button.customId) {
                case 'mute1': 
                    member?.disableCommunicationUntil(Date.now() + (60 * 1000))
                    // member?.timeout(60 * 1000) // 1 min
                    break;
                case 'mute2':
                    member?.disableCommunicationUntil(Date.now() + (300 * 1000))
                    // member?.timeout(300 * 1000) // 5min
                    break;
                case 'mute3':
                    member?.disableCommunicationUntil(Date.now() + (600 * 1000))
                    // member?.timeout(600 * 1000) // 10 min
                    break;
                case 'mute4':
                    member?.disableCommunicationUntil(Date.now() + (3600 * 1000))
                    // member?.timeout(3600 * 1000) // 1 hour
                    break;
                case 'mute5':
                    member?.disableCommunicationUntil(Date.now() + (86400 * 1000))
                    // member?.timeout( 86400 * 1000) // 1 day
                    break;
                case 'mute6':
                    member?.disableCommunicationUntil(Date.now() + (604800 * 1000))
                    // member?.timeout(604800 * 1000) // 1 week
                    break;
            } 
        });
    }
}