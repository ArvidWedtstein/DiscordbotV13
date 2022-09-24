import Client from '../Client';
import { CommandInteraction, Interaction, Message, ApplicationCommandType, ApplicationCommandOption, ApplicationCommandOptionType, PermissionsString, CommandInteractionOptionResolver } from 'discord.js';

interface Run {
    (client: Client, interaction: Interaction): any;
}

export interface SlashCommand {
    name: string;
    description?: string;
    group?: string;
    ClientPermissions?: PermissionsString[];
    permissions?: PermissionsString[];
    type?: ApplicationCommandType;
    testOnly?: boolean;
    options?: ApplicationCommandOption[];   
    run: Run;
}
