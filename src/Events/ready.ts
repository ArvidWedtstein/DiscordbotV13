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
        client.slashCommands.map((value: any) => {
            const file = require(value);
            if (!file?.name) return;
            client.slashCommands.set(file.name, file);
    
            if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
            arrayOfSlashCommands.push(file);
        });
        await client.guilds.cache.get('524951977243836417')?.commands.set(arrayOfSlashCommands);
    }
}