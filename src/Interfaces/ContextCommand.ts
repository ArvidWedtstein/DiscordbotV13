import Client from '../Client';
import { CommandInteraction, Interaction, Message, ApplicationCommandType, ApplicationCommandOption, ApplicationCommandOptionType, ContextMenuInteraction } from 'discord.js';


interface Run {
    (client: Client, interaction: ContextMenuInteraction): any;
}

export interface SlashCommand {
    name: string;
    group?: string;
    testOnly?: boolean;
    run: Run;
}
