import Client from '../Client';
import { CommandInteraction, Message } from 'discord.js';

interface Run {
    (client: Client, interation: CommandInteraction, args: string[]): any;
}

export interface SlashCommand {
    name: string;
    description?: string;
    aliases?: string[];
    run: Run;
}