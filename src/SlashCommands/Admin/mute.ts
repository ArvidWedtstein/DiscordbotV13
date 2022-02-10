import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { SlashCommand } from '../../Interfaces';
import messageCountSchema from "../../schemas/messageCountSchema";
export const slashCommand: SlashCommand = {
    name: "mute",
    type: "USER",
    permissions: ['KICK_MEMBERS', 'MUTE_MEMBERS'],
    ClientPermissions: ['MUTE_MEMBERS', 'KICK_MEMBERS'],
    testOnly: true,
    run: async (client, interaction) => {
        // if (!interaction.isCommand()) return
        if (interaction.isCommand()) return
        // if (interaction.isContextMenu()) return
        if (interaction.isUserContextMenu()) {
            const embed = new MessageEmbed()
                .setAuthor({name: `${interaction.member?.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setDescription(`choose timeout length for`)
                .setFooter(`${interaction.targetUser.tag}`, interaction.targetUser.displayAvatarURL())
                
            const row = new MessageActionRow() 
                .addComponents(
                    new MessageButton()
                        .setLabel('60 sec')
                        .setCustomId('mute1')
                        .setStyle('DANGER')
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('5 min')
                        .setCustomId('mute2')
                        .setStyle('DANGER')
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('10 min')
                        .setCustomId('mute3')
                        .setStyle('DANGER')
                )
            const row2 = new MessageActionRow() 
                .addComponents(
                    new MessageButton()
                        .setLabel('1 hour')
                        .setCustomId('mute4')
                        .setStyle('DANGER')
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('1 day')
                        .setCustomId('mute5')
                        .setStyle('DANGER')
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('1 week')
                        .setCustomId('mute6')
                        .setStyle('DANGER')
                )

            interaction.followUp({ embeds: [embed], components: [row, row2]})

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
}