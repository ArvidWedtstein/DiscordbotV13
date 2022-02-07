import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "ping",
    description: "ping",
    type: "CHAT_INPUT",
    run: async (client, interaction) => {
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