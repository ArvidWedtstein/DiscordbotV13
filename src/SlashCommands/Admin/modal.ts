import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ModalBuilder, TextInputComponent, ActionRowBuilder, ModalActionRowComponent, Formatters, ApplicationCommandType, TextInputBuilder } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "modal",
    description: "modAL",
    type: ApplicationCommandType.ChatInput,
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
        if (!interaction.isCommand()) return

        if (interaction.isModalSubmit()) {
            
        }
        
        const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal')
        const favoriteColorInput = new TextInputBuilder()
			.setCustomId('favoriteColorInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle(1);

        const hobbiesInput = new TextInputBuilder()
			.setCustomId('hobbiesInput')
			.setLabel("What's some of your favorite hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle(2);


        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(hobbiesInput);
		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);
		// Show the modal to the user
		await interaction.showModal(modal);
        return 
    }
    
}