import Client from '../Client';
import { CommandInteraction, Interaction, Message, ApplicationCommandType, ApplicationCommandOption, PermissionString } from 'discord.js';


interface Run {
    (client: Client, interaction: Interaction): any;
}

export interface UserContextMenu {
    name: string;
    description?: string;
    group?: string;
    ClientPermissions?: PermissionString[];
    permissions?: PermissionString[];
    type?: ApplicationCommandType;
    testOnly?: boolean;
    run: Run;
}
