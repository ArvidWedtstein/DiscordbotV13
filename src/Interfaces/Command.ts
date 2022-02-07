import Client from '../Client';
import { Message, PermissionString } from 'discord.js';

interface Run {
    (client: Client, message: Message, args: string[]): any;
}

export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
    permissions?: PermissionString[];
    ownerOnly?: boolean;
    hidden?: boolean;
    disabled?: boolean;
    run: Run;
}