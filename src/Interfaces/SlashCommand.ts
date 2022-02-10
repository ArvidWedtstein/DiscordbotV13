import Client from '../Client';
import { CommandInteraction, Interaction, Message, ApplicationCommandType, ApplicationCommandOption, ApplicationCommandOptionType, PermissionString } from 'discord.js';


interface Run {
    (client: Client, interaction: Interaction): any;
}

export interface SlashCommand {
    name: string;
    description?: string;
    group?: string;
    ClientPermissions?: PermissionString[];
    permissions?: PermissionString[];
    type?: ApplicationCommandType;
    testOnly?: boolean;
    options?: ApplicationCommandOption[];
    run: Run;
    
}
