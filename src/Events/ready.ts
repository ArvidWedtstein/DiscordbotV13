import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import { loadLanguages } from '../Functions/language';
import { BrawlhallaStream } from '../Functions/BrawlhallaStream';
import { loadColors } from '../Functions/icon';
import reactionroles from '../Functions/ReactionRole'
import birthday from '../Functions/birthday';
import path from 'path';

export const event: Event = {
    name: "ready",
    run: async (client) => {
        console.log(`${gradient.atlas(client.user?.tag)} is ${gradient.summer('online!')}`);
        /* Init Language */
        loadLanguages(client);
        // const arrayOfSlashCommands: any = [];

        // Load Icon Colors
        loadColors(client);

        // Check for birthdays
        birthday(client);

        // Check for brawlhalla stream
        BrawlhallaStream(client);
        // await client.guilds?.cache.get('524951977243836417')?.commands.set(arrayOfSlashCommands);

        // Check for reaction roles
        reactionroles(client);

        console.log(`${gradient.atlas(`Commands loaded: ${await client.registry.commands.size}`)}`);
    }
}