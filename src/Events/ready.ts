import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import { loadLanguages } from '../language';

export const event: Event = {
    name: "ready",
    run: async (client) => {
        console.log(`${gradient.atlas(client.user?.tag)} is ${gradient.summer('online!')}`);
        /* Init Language */
        loadLanguages(client);
        const arrayOfSlashCommands: any = [];

        await client.guilds?.cache.get('524951977243836417')?.commands.set(arrayOfSlashCommands);
    }
}