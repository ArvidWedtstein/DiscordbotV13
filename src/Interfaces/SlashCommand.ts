import Client from '../Client';
import { CommandInteraction, Interaction, Message, ApplicationCommandType, ApplicationCommandOption, ApplicationCommandOptionType } from 'discord.js';


interface Run {
    (client: Client, interaction: Interaction): any;
}

export interface SlashCommand {
    name: string;
    description?: string;
    group?: string;
    type?: ApplicationCommandType;
    testOnly?: boolean;
    options?: ApplicationCommandOption[];
    run: Run;
}
