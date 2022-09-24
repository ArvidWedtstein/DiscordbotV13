import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType, CommandInteraction, ContextMenuCommandInteraction } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "getavatar",
    // description: "getavatar",
    type: ApplicationCommandType.User,
    permissions: ["Administrator"],
    // options: [
    //     {
    //         name: "test",
    //         type: "BOOLEAN",
    //         description: "test"
    //     }  
    // ],
    testOnly: true,
    run: async (client, interaction) => {
        if (!interaction.isUserContextMenuCommand()) return

        
        if (interaction.isUserContextMenuCommand()) {

            // const msg = await interaction.channel?.messages.fetch(
            //     interaction.targetId
            // )
            const user = interaction.targetUser
            await interaction.reply({ content: `.${user.avatarURL()?.toString()}`, fetchReply: true })
            return
        }
        // if (interaction.isContextMenu()) console.log('context MENU')
        //const subCommand = interaction.options.getSubcommand();
        
    }
    
}