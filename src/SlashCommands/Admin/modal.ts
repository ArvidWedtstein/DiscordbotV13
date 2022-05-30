import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction, Modal, TextInputComponent, MessageActionRow, ModalActionRowComponent, Formatters } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "modal",
    description: "modAL",
    type: "CHAT_INPUT",
    permissions: ["ADMINISTRATOR"],
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
        const modal = new Modal()
			.setCustomId('myModal')
			.setTitle('My Modal')
        const favoriteColorInput = new TextInputComponent()
			.setCustomId('favoriteColorInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle('SHORT');

        const hobbiesInput = new TextInputComponent()
			.setCustomId('hobbiesInput')
			.setLabel("What's some of your favorite hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle('PARAGRAPH');


        const firstActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(favoriteColorInput);
		const secondActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(hobbiesInput);
		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);
		// Show the modal to the user
		await interaction.showModal(modal);
        return 
    }
    
}