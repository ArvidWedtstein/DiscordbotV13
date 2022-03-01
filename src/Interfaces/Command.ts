import Client from '../Client';
import { Message, PermissionString } from 'discord.js';

interface Run {
    (client: Client, message: Message, args: string[]): any;
}

export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
    details?: string;
    group?: any;
    UserPermissions?: PermissionString[];
    ClientPermissions?: PermissionString[];
    ownerOnly?: boolean;
    hidden?: boolean;
    disabled?: boolean;
    examples?: string[];
    run: Run;
}
