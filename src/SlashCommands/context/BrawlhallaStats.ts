import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType, CommandInteraction } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "brawlhallastats",
    description: "get brawlhallastats",
    type: ApplicationCommandType.User,
    permissions: ["SEND_MESSAGES"],
    testOnly: false,
    run: async (client, interaction) => {
        if (!interaction.isUserContextMenuCommand()) return

        
        const msg = await interaction.channel?.messages.fetch(
            interaction.targetId
        )
        const user = interaction.targetUser
        await interaction.reply({ content: `.${user.avatarURL()?.toString()}`, fetchReply: true })
        return
        // if (interaction.isContextMenu()) console.log('context MENU')
        //const subCommand = interaction.options.getSubcommand();
        
    }
    
}