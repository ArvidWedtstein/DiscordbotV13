import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import { loadLanguages } from '../Functions/language';
import { brawlhalla } from '../Functions/brawlhalla';
import { loadColors } from '../Functions/icon';
import birthday from '../Functions/birthday';

export const event: Event = {
    name: "ready",
    run: async (client) => {
        console.log(`${gradient.atlas(client.user?.tag)} is ${gradient.summer('online!')}`);
        /* Init Language */
        loadLanguages(client);
        const arrayOfSlashCommands: any = [];

        // Load Icon Colors
        loadColors(client);

        // Check for birthdays
        birthday(client);

        // Check for brawlhalla stream
        brawlhalla(client);
        await client.guilds?.cache.get('524951977243836417')?.commands.set(arrayOfSlashCommands);
    }
}