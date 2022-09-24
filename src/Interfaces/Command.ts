import Client from '../Client';
import { Message, PermissionsString } from 'discord.js';

interface Run {
    (client: Client, message: Message, args: string[]): any;
}

export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
    details?: string;
    group?: any;
    UserPermissions?: PermissionsString[];
    ClientPermissions?: PermissionsString[];
    ownerOnly?: boolean;
    hidden?: boolean;
    disabled?: boolean;
    examples?: string[];
    cooldown?: number;
    run: Run;
}
