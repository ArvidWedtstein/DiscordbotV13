import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "getavatar",
    description: "getavatar",
    type: "MESSAGE",
    run: async (client, interaction) => {
        interaction.followUp({ content: `${client.ws.ping}ms!`})
    }
    
}