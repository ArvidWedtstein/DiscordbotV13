import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "ping",
    description: "ping",
    run: async (client, interaction, args) => {
        new SlashCommandBuilder()
        .setName("ping")
        .setDescription("ping")
        .addStringOption((option) => 
            option  
                .setName('message')
                .setDescription("message that you want to repeat")
                .setRequired(true)
        )
    }
    
}