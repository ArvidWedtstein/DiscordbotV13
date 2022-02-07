import Client from '../Client';
import { CommandInteraction, Interaction, Message, ApplicationCommandType } from 'discord.js';

interface Run {
    (client: Client, interaction: CommandInteraction): any;
}

export interface SlashCommand {
    name: string;
    description?: string;
    type?: ApplicationCommandType;
    run: Run;
}