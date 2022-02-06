import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import { loadLanguages } from '../language';

export const event: Event = {
    name: "ready",
    run: (client) => {
        console.log(`${gradient.atlas(client.user?.tag)} is ${gradient.summer('online!')}`);
        /* Init Language */
        loadLanguages(client);
    }
}