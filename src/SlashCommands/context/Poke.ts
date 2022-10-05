import { ApplicationCommandType, CommandInteraction } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "poke",
    description: "Poke someone",
    type: ApplicationCommandType.User,
    default_permission: ["SendMessages"],
    testOnly: false,
    run: async (client, interaction) => {
        if (!interaction.isUserContextMenuCommand()) return

        
        const msg = await interaction.channel?.messages.fetch(
            interaction.targetId
        )
        const user = interaction.targetUser
        user.send(`You have been poked by ${interaction.user.tag} in ${interaction.guild?.name}!`)
        await interaction.reply(`Poked ${user.tag}!`)
        return
        // if (interaction.isContextMenu()) console.log('context MENU')
        //const subCommand = interaction.options.getSubcommand();
        
    }
    
}