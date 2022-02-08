import { Event, Command, SlashCommand} from '../Interfaces';
import Client from '../Client';
import { Interaction, Message, CommandInteraction } from 'discord.js';

export const event: Event = {
    name: "interactionCreate",
    run: async (client: Client, interaction: Interaction) => {
        if (
            interaction.user.bot ||
            !interaction.guild
        ) return;
        if (interaction.isCommand()) {
            interaction.deferReply({ ephemeral: true})
            const cmd = interaction.commandName
            if (!cmd) return;
            const command = client.slashCommands.get(cmd)
            if (command) (command as SlashCommand).run(client, interaction);
        };
        if (interaction.isButton()) return
        if (interaction.isContextMenu() || interaction.isUserContextMenu()) {
            await interaction.deferReply({ ephemeral: true });
            console.log(client.slashCommands.get(interaction.commandName))
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
    }
}