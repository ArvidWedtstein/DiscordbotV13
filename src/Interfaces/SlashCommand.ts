import Client from '../Client';
import { CommandInteraction, Interaction, Message, ApplicationCommandType, ApplicationCommandOption, ApplicationCommandOptionType, PermissionsString, CommandInteractionOptionResolver } from 'discord.js';
import { Locale } from './Locales'
interface Run {
    (client: Client, interaction: Interaction): any;
}

export interface SlashCommand {
    name: string;
    description?: string;
    name_localizations?: Partial<Record<Locale, string>>;
    description_localizations?: Partial<Record<Locale, string>>;
    group?: string;
    ClientPermissions?: PermissionsString[];
    default_permission?: PermissionsString[];
    default_member_permissions?: PermissionsString[];
    dm_permission?: PermissionsString[];
    type?: ApplicationCommandType;
    testOnly?: boolean;
    options?: ApplicationCommandOption[];   
    run: Run;
}
