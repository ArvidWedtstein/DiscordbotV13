import { Event, Command, SlashCommand} from '../Interfaces';
import Client from '../Client';
import { Interaction, Message, CommandInteraction } from 'discord.js';

export const event: Event = {
    name: "interactionCreate",
    run: async (client: Client, interaction) => {
        if (
            interaction.user.bot ||
            !interaction.guild
        ) return;
        if (interaction.isCommand()) {
    
            const cmd = interaction.commandName
            if (!cmd) return;
            const command = client.slashCommands.get(cmd)
            if (command) (command as SlashCommand).run(client, interaction);
        };
        if (interaction.isButton()) return
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
    }
}